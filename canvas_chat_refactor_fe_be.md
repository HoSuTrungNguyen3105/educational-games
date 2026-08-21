# Game Area Chat / Messaging – FE + BE Refactor

## 1. Overview

Refactor khu vực **Chat / Messaging nằm bên trong Game Area**, tập trung vào cả **Frontend (FE)** và **Backend (BE)**.

Phạm vi này **không bao gồm Canvas refactor**. Chat là một phần của khu vực chơi game và cần được thiết kế để hoạt động tốt trên desktop, tablet và đặc biệt là mobile.

Mục tiêu chính:

- Cải thiện UI/UX của Chat trong Game Area.
- Responsive tốt trên mobile portrait / landscape.
- Không làm Chat ảnh hưởng không cần thiết đến Game Area.
- Chuẩn hóa message state và data flow giữa FE / BE.
- Hỗ trợ realtime ổn định.
- Xử lý pagination, unread/read state, retry và message ordering.
- Tách Chat logic khỏi Game logic để dễ maintain và scale.

---

# 2. Scope

```text
Game Area
├── Game
│
└── Chat / Messaging
    ├── Chat Header
    ├── Message List
    ├── Message Item
    ├── Message Composer
    ├── Attachment / Media (nếu có)
    ├── Typing Indicator (nếu có)
    ├── Read / Unread State
    ├── Realtime Events
    ├── Pagination
    ├── Send / Retry / Error
    └── Responsive Mobile UI
```

Không nằm trong scope:

- Canvas architecture.
- Canvas renderer.
- Canvas selection / zoom / pan.
- Canvas history.
- Canvas object manipulation.

---

# 3. Current Problems

## 3.1. Frontend

Khu vực Chat hiện cần được rà soát và refactor ở các điểm:

- Chat UI chưa responsive tốt trên mobile.
- Chat có thể chiếm quá nhiều diện tích của Game Area.
- Message list và input chưa xử lý tốt khi mobile keyboard mở.
- Có nguy cơ horizontal overflow.
- Scroll message chưa ổn định khi load thêm message.
- New message có thể làm mất scroll position hiện tại.
- Realtime update có thể gây unnecessary re-render.
- Chat state chưa được tách rõ khỏi state của Game.
- Send / retry / failed state chưa thống nhất.
- Read / unread state cần được chuẩn hóa.

## 3.2. Backend

Backend cần review và chuẩn hóa:

- Conversation / room model.
- Message model.
- Create/send message API.
- Fetch message API.
- Pagination.
- Realtime events.
- Read state.
- Unread count.
- Message ordering.
- Duplicate prevention / idempotency.
- Authorization.
- Validation.
- Error handling.
- Persistence.

---

# 4. Target Architecture

```text
                       Game Area
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
            Game                 Chat / Messaging
                                      │
                        ┌─────────────┼─────────────┐
                        ▼             ▼             ▼
                       UI           State        Realtime
                        │             │             │
                        └─────────────┼─────────────┘
                                      ▼
                                     API
                                      │
                                      ▼
                                     BE
                          ┌───────────┼───────────┐
                          ▼           ▼           ▼
                        REST        Realtime    Database
```

Nguyên tắc:

- Game state và Chat state phải tách biệt.
- Message persisted data do BE làm source of truth.
- FE có thể optimistic update đối với send message nếu phù hợp.
- Realtime event phải có contract rõ ràng.
- Chat UI không được phụ thuộc trực tiếp vào implementation của Game.
- Một message mới không nên trigger re-render toàn bộ Game Area.

---

# 5. FE Architecture

## 5.1. Suggested Structure

```text
features/
└── game-area/
    ├── components/
    │   └── chat/
    │       ├── ChatPanel/
    │       ├── ChatHeader/
    │       ├── MessageList/
    │       ├── MessageItem/
    │       ├── MessageComposer/
    │       ├── ChatEmptyState/
    │       ├── ChatLoadingState/
    │       └── ChatErrorState/
    │
    ├── hooks/
    │   ├── useChat/
    │   ├── useMessages/
    │   ├── useSendMessage/
    │   ├── useChatRealtime/
    │   └── useMessagePagination/
    │
    ├── state/
    │   ├── chatStore/
    │   └── chatSelectors/
    │
    ├── services/
    │   ├── chatApi/
    │   └── chatRealtime/
    │
    ├── types/
    │   └── chat.ts
    │
    └── utils/
        ├── message.ts
        ├── scroll.ts
        └── pagination.ts
```

Structure có thể thay đổi theo convention hiện tại của project, nhưng cần giữ separation giữa:

```text
UI
State
API
Realtime
Business Logic
```

---

# 6. FE State Management

## 6.1. Chat State

Ví dụ:

```ts
type ChatState = {
  conversationId: string | null;
  messages: Message[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  isSending: boolean;
  unreadCount: number;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
};
```

## 6.2. Composer State

Không nên để input draft nằm trong message list state.

```ts
type ComposerState = {
  text: string;
  attachments: Attachment[];
  isSubmitting: boolean;
};
```

## 6.3. UI State

```ts
type ChatUIState = {
  isOpen: boolean;
  isExpanded: boolean;
  isAtBottom: boolean;
  showUnreadIndicator: boolean;
};
```

Cần tránh một state object quá lớn chứa tất cả Chat data + UI state + composer state.

---

# 7. Message Model

FE và BE cần thống nhất contract.

Ví dụ:

```ts
type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  type: 'text' | 'image' | 'file' | 'system';
  content: string;
  createdAt: string;
  updatedAt?: string;
  status?: 'sending' | 'sent' | 'failed';
  replyToId?: string | null;
  attachments?: Attachment[];
};
```

Không nên để FE và BE sử dụng hai structure message khác nhau mà không có mapping rõ ràng.

---

# 8. Chat UI trong Game Area

## 8.1. Desktop

Chat có thể hiển thị như một panel bên cạnh Game:

```text
┌──────────────────────┬───────────────────────┐
│                      │ Chat                  │
│                      ├───────────────────────┤
│       GAME           │ Message 1             │
│                      │ Message 2             │
│                      │ Message 3             │
│                      │                       │
│                      ├───────────────────────┤
│                      │ Type message...  Send │
└──────────────────────┴───────────────────────┘
```

Chat panel không được làm Game bị crop hoặc tạo horizontal overflow ngoài ý muốn.

## 8.2. Mobile

Không nên giữ Chat như một sidebar cố định bên phải.

Game Area ưu tiên hiển thị Game:

```text
┌───────────────────────────────┐
│ Game Header              Chat │
├───────────────────────────────┤
│                               │
│                               │
│             GAME              │
│                               │
│                               │
├───────────────────────────────┤
│ Game Actions                  │
└───────────────────────────────┘
```

Khi mở Chat:

```text
┌───────────────────────────────┐
│ Chat                      ✕   │
├───────────────────────────────┤
│                               │
│ Message 1                     │
│ Message 2                     │
│ Message 3                     │
│                               │
├───────────────────────────────┤
│ Type message...          Send │
└───────────────────────────────┘
```

Có thể sử dụng:

- Bottom Sheet.
- Drawer.
- Fullscreen Sheet.
- Overlay Chat.

Tùy UX hiện tại của product, nhưng phải đảm bảo Game không bị resize/crop bất thường.

---

# 9. Mobile Responsive Requirements

## 9.1. Main Principles

Mobile không nên chỉ là desktop được scale xuống.

Chat cần responsive theo available space.

Các yêu cầu:

- Không horizontal overflow.
- Không che Game ngoài chủ đích.
- Input luôn accessible.
- Message list scroll độc lập.
- Portrait / landscape đều hoạt động.
- Chat mở / đóng nhanh.
- Mobile keyboard không che input.
- Safe area được hỗ trợ.

---

# 10. Mobile Keyboard

Đây là phần cần ưu tiên.

Khi keyboard mở:

```text
┌───────────────────────────────┐
│ Message list                  │
│                               │
│                               │
├───────────────────────────────┤
│ Input                   Send  │
└───────────────────────────────┘
          ↑
       Keyboard
```

Không được để keyboard che mất:

- Message input.
- Send button.
- Message đang typing.

Không nên hard-code toàn bộ layout bằng `100vh` nếu gây lỗi khi keyboard mở.

Ưu tiên sử dụng viewport unit phù hợp (`dvh`) và/hoặc Visual Viewport API nếu cần xử lý browser behavior cụ thể.

---

# 11. Safe Area

Chat header và composer cần support:

```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

Đặc biệt khi Chat sử dụng fullscreen hoặc bottom sheet trên mobile.

---

# 12. Message List

Message list phải có behavior ổn định.

## Khi mở Chat lần đầu

```text
Load latest messages
        ↓
Render messages
        ↓
Scroll to bottom
```

## Khi có message mới

Nếu user đang ở cuối:

```text
New message
    ↓
Append message
    ↓
Auto scroll to bottom
```

Nếu user đang đọc message cũ:

```text
New message
    ↓
Do NOT force scroll
    ↓
Show unread/new message indicator
```

## Khi load older messages

```text
Scroll near top
        ↓
Fetch older messages
        ↓
Prepend messages
        ↓
Preserve previous visible position
```

Không được làm user bị nhảy về cuối conversation khi load older messages.

---

# 13. Pagination

Ưu tiên cursor-based pagination cho message list.

Ví dụ request:

```http
GET /conversations/:conversationId/messages?limit=30&before=<cursor>
```

Response:

```json
{
  "items": [],
  "nextCursor": "...",
  "hasMore": true
}
```

Không nên tải toàn bộ conversation nếu conversation có lượng message lớn.

---

# 14. Message Ordering

BE phải đảm bảo ordering ổn định.

FE không nên chỉ dựa vào array position để xác định thứ tự message.

Ưu tiên sử dụng:

```text
createdAt
+ stable message id
```

để xử lý các trường hợp timestamp trùng nhau.

Realtime event và REST response phải có cách merge thống nhất.

---

# 15. Send Message Flow

Recommended flow:

```text
User types message
        ↓
Submit
        ↓
Validate
        ↓
Optimistic message
        ↓
POST /messages
        ↓
BE persist
        ↓
Success → replace/update optimistic message
        ↓
Failure → mark failed + Retry
```

Optimistic message cần có temporary client id:

```ts
clientMessageId: string;
```

Không sử dụng temporary id làm persistent database id.

---

# 16. Idempotency

BE cần xử lý trường hợp FE retry do:

- Network timeout.
- User bấm Send nhiều lần.
- Reconnect.
- Request gửi thành công nhưng FE không nhận được response.

Mỗi request gửi message nên hỗ trợ `clientMessageId` hoặc idempotency key.

Ví dụ:

```json
{
  "clientMessageId": "client-abc-123",
  "conversationId": "conversation-123",
  "content": "Hello"
}
```

BE không được tạo duplicate message khi cùng một `clientMessageId` được gửi lại.

---

# 17. Retry Failed Message

Message failed nên có UI rõ ràng:

```text
┌──────────────────────────┐
│ Hello world              │
│ Failed to send   Retry ↻ │
└──────────────────────────┘
```

Retry phải reuse `clientMessageId` hoặc cơ chế idempotency tương ứng để tránh duplicate.

---

# 18. Realtime

Chat cần có realtime channel theo conversation/game room.

Event nên có contract rõ ràng.

Ví dụ:

```text
message.created
message.updated
message.deleted
message.read
conversation.updated
user.typing
user.stopped_typing
```

Payload nên có version hoặc schema rõ ràng nếu hệ thống cần backward compatibility.

---

# 19. Realtime Message Flow

```text
User A
  ↓
BE API
  ↓
Database
  ↓
Realtime Event
  ↓
Conversation Subscribers
  ↓
User B / User C
```

Không nên để FE tự coi optimistic message là message persisted nếu chưa có confirmation từ BE.

---

# 20. Reconnection

Khi mất realtime connection:

```text
connected
   ↓
disconnected
   ↓
reconnecting
   ↓
connected
```

FE cần:

- Hiển thị connection state nếu UX yêu cầu.
- Re-subscribe conversation.
- Sync các message bị miss trong khoảng thời gian mất connection.
- Deduplicate message sau khi reconnect.

Không chỉ dựa vào realtime event để đảm bảo message không bị mất.

---

# 21. Read / Unread State

Cần thống nhất behavior:

- Khi Chat đang mở và user ở gần cuối → mark as read.
- Khi Chat đang đóng → tăng unread count.
- Khi user mở Chat → sync read state.
- Khi scroll đến message mới nhất → mark read.

Có thể sử dụng:

```text
lastReadMessageId
```

hoặc:

```text
lastReadAt
```

Tùy data model hiện tại.

---

# 22. Read State API

Ví dụ:

```http
POST /conversations/:conversationId/read
```

Body:

```json
{
  "messageId": "message-123"
}
```

BE cần validate user có quyền truy cập conversation trước khi update read state.

---

# 23. Unread Count

Unread count cần được cập nhật nhất quán giữa:

- Initial API response.
- Realtime event.
- Mark as read.
- Conversation reopen.
- Reconnect.

Không để FE tự tính unread count một cách độc lập nếu BE đã là source of truth.

---

# 24. Backend API

API tối thiểu:

```text
GET    /conversations/:conversationId/messages
POST   /conversations/:conversationId/messages
POST   /conversations/:conversationId/read
GET    /conversations/:conversationId/unread
```

Nếu có attachment:

```text
POST /conversations/:conversationId/attachments
```

Tên endpoint có thể thay đổi theo API convention hiện tại.

---

# 25. Backend Authorization

Mọi endpoint cần validate:

1. User đã authenticate.
2. User có quyền truy cập Game / Room.
3. User có quyền truy cập Conversation.
4. Message thuộc đúng Conversation.
5. Payload hợp lệ.

Không trust trực tiếp `senderId` từ client.

BE phải lấy identity từ authenticated context.

---

# 26. Backend Validation

Message cần validate:

- Content không được empty nếu message type yêu cầu text.
- Maximum length.
- Attachment type / size nếu có.
- Conversation tồn tại.
- User có quyền gửi message.
- Payload schema hợp lệ.

Không nên chỉ validate ở FE.

---

# 27. Database Model

Ví dụ:

```text
Conversation
├── id
├── gameRoomId
├── createdAt
└── updatedAt

ConversationMember
├── conversationId
├── userId
├── lastReadMessageId
└── updatedAt

Message
├── id
├── conversationId
├── senderId
├── clientMessageId
├── type
├── content
├── createdAt
└── updatedAt
```

Cần index tối thiểu cho:

```text
conversationId
createdAt
clientMessageId
```

Tùy database có thể cần composite index:

```text
(conversationId, createdAt)
```

để pagination hiệu quả.

---

# 28. Message Deduplication

FE và BE cần xử lý duplication ở hai level.

## FE

Khi nhận realtime event:

```text
message.id đã tồn tại?
        ↓
      YES → update/ignore
      NO  → append
```

## BE

`clientMessageId` cần unique trong phạm vi phù hợp để retry không tạo duplicate.

---

# 29. Message Update / Delete

Nếu product có edit/delete message, cần realtime events:

```text
message.updated
message.deleted
```

FE phải update đúng message item thay vì reload toàn bộ conversation.

BE cần authorization cho sender / role tương ứng.

---

# 30. Chat Composer

Composer cần support:

```text
Text input
Send
Loading
Failed
Retry
Disabled
Attachment (nếu có)
Emoji (nếu có)
```

Không nên để submit button phụ thuộc vào network state theo cách làm mất draft của user.

Khi request fail:

```text
Draft / failed message
        ↓
Giữ content
        ↓
Retry
```

---

# 31. Mobile Touch UX

Các action chính phải dễ thao tác trên touch screen:

- Open Chat.
- Close Chat.
- Send message.
- Retry.
- Scroll message.
- Attachment.
- Back.

Không nên phụ thuộc vào hover hoặc right-click.

---

# 32. Mobile Chat Open / Close

### Closed

Game chiếm phần lớn available area.

```text
┌───────────────────────────────┐
│ Game Header              Chat │
├───────────────────────────────┤
│                               │
│             GAME              │
│                               │
│                               │
├───────────────────────────────┤
│ Game Actions                  │
└───────────────────────────────┘
```

### Open

```text
┌───────────────────────────────┐
│ Chat                      ✕   │
├───────────────────────────────┤
│ Message                       │
│ Message                       │
│ Message                       │
│                               │
├───────────────────────────────┤
│ Type message...          Send │
└───────────────────────────────┘
```

Chat có thể là overlay / bottom sheet / fullscreen tùy breakpoint.

---

# 33. Responsive Breakpoints

Tối thiểu test:

```text
360 × 800
375 × 812
390 × 844
412 × 915
768 × 1024
1024 × 768
```

Cần test:

```text
Portrait
Landscape
Keyboard open
Keyboard closed
```

Không chỉ test theo viewport width; cần test actual available height khi browser UI và keyboard thay đổi.

---

# 34. Performance – FE

Chat không được ảnh hưởng đến performance của Game.

Cần đảm bảo:

- Message mới không làm render lại toàn bộ Game.
- Message item có thể memoize khi phù hợp.
- Không recreate toàn bộ message array không cần thiết.
- Realtime subscription không bị duplicate.
- Cleanup subscription khi unmount.
- Không attach event listener nhiều lần.
- Pagination không block UI.
- Với conversation rất lớn, cân nhắc virtualization.

---

# 35. Performance – BE

Backend cần:

- Cursor pagination.
- Database indexes phù hợp.
- Không query toàn bộ conversation để lấy unread count.
- Không broadcast event thừa.
- Realtime subscription theo conversation/game room.
- Có rate limit nếu cần.
- Có giới hạn message size.

---

# 36. Error Handling

## FE

Các state cần phân biệt:

```text
Loading
Loading more
Sending
Sent
Failed
Reconnecting
Disconnected
Empty
Error
```

Không dùng một `isLoading` cho tất cả trạng thái.

## BE

Response cần có error contract thống nhất.

Ví dụ:

```json
{
  "code": "MESSAGE_SEND_FAILED",
  "message": "Unable to send message"
}
```

Không expose stack trace hoặc internal error details ra client.

---

# 37. Security

BE phải xử lý:

- Authentication.
- Authorization.
- Input validation.
- Message length limit.
- Attachment validation nếu có.
- Rate limiting nếu cần.
- XSS / unsafe HTML nếu message hỗ trợ rich text.
- Access control theo Game / Room / Conversation.

Nếu text message được render thành HTML, cần sanitize nghiêm ngặt.

---

# 38. Testing – FE

## Unit Test

```text
[ ] Message sorting
[ ] Message deduplication
[ ] Pagination
[ ] Unread calculation / state sync
[ ] Optimistic message
[ ] Retry message
[ ] Scroll behavior
[ ] New message behavior
```

## Integration Test

```text
[ ] Open chat → load messages
[ ] Send message → success
[ ] Send message → failure → retry
[ ] Receive realtime message
[ ] Receive duplicate realtime message
[ ] Load older messages
[ ] Mark as read
[ ] Reconnect realtime
```

## Mobile E2E

```text
[ ] Open Chat
[ ] Close Chat
[ ] Type message
[ ] Keyboard opens
[ ] Input remains visible
[ ] Send message
[ ] Scroll messages
[ ] Receive new message
[ ] Rotate portrait → landscape
[ ] Rotate landscape → portrait
```

---

# 39. Testing – BE

## API Test

```text
[ ] Get messages
[ ] Pagination
[ ] Send message
[ ] Duplicate clientMessageId
[ ] Unauthorized access
[ ] Invalid conversation
[ ] Invalid payload
[ ] Message too long
[ ] Read state
```

## Realtime Test

```text
[ ] New message broadcast
[ ] Update message broadcast
[ ] Delete message broadcast
[ ] Reconnect
[ ] No duplicate delivery handling
[ ] User cannot subscribe to unauthorized conversation
```

---

# 40. Acceptance Criteria

## FE

- [ ] Chat được tách thành module riêng.
- [ ] Chat state không nằm chung với Game state.
- [ ] Message list có pagination.
- [ ] New message không làm mất scroll position không cần thiết.
- [ ] Loading older messages giữ được vị trí scroll.
- [ ] Optimistic message hoạt động đúng.
- [ ] Failed message có retry.
- [ ] Realtime subscription được cleanup.
- [ ] Không có unnecessary full Game re-render.

## Mobile UI

- [ ] Chat hiển thị tốt trên mobile portrait.
- [ ] Chat hiển thị tốt trên mobile landscape.
- [ ] Không horizontal overflow.
- [ ] Chat không che Game ngoài behavior chủ đích.
- [ ] Input không bị keyboard che.
- [ ] Safe area được support.
- [ ] Message list scroll mượt.
- [ ] Open / close Chat rõ ràng.

## BE

- [ ] API contract được chuẩn hóa.
- [ ] Cursor pagination được hỗ trợ.
- [ ] Message ordering ổn định.
- [ ] `clientMessageId` / idempotency được xử lý.
- [ ] Duplicate message được ngăn chặn.
- [ ] Realtime event có contract rõ ràng.
- [ ] Read/unread state được persist đúng.
- [ ] Authorization được validate ở BE.
- [ ] Message payload được validate.
- [ ] Database có index phù hợp.

---

# 41. Implementation Priority

## P0 – Must Have

```text
1. Refactor Chat UI trong Game Area
2. Mobile responsive Chat
3. Message list + pagination
4. Send message flow
5. Realtime message delivery
6. Input + mobile keyboard handling
7. Read / unread state
8. Duplicate / idempotency handling
```

## P1 – Important

```text
1. Retry failed message
2. Reconnection handling
3. Scroll position preservation
4. Mobile bottom sheet / overlay UX
5. Performance optimization
6. Better error state
```

## P2 – Enhancement

```text
1. Virtualized message list
2. Typing indicator
3. Attachments
4. Reply / quote
5. Edit / delete message
6. Rich message types
```

---

# 42. Expected Result

Sau refactor, Game Area nên có behavior như sau:

```text
Desktop

┌─────────────────────────────────────────────┐
│                  GAME AREA                   │
│                                             │
│  ┌─────────────────────────┐ ┌────────────┐ │
│  │                         │ │    CHAT    │ │
│  │          GAME           │ │            │ │
│  │                         │ │ Messages   │ │
│  │                         │ │            │ │
│  └─────────────────────────┘ ├────────────┤ │
│                              │ Input Send │ │
│                              └────────────┘ │
└─────────────────────────────────────────────┘
```

```text
Mobile – Chat Closed

┌───────────────────────────────┐
│ Game Header              Chat │
├───────────────────────────────┤
│                               │
│                               │
│             GAME              │
│                               │
│                               │
├───────────────────────────────┤
│ Game Actions                  │
└───────────────────────────────┘
```

```text
Mobile – Chat Open

┌───────────────────────────────┐
│ Chat                      ✕   │
├───────────────────────────────┤
│                               │
│ Message                       │
│ Message                       │
│ Message                       │
│                               │
├───────────────────────────────┤
│ Type message...          Send │
└───────────────────────────────┘
```

Mục tiêu cuối cùng là xây dựng **một Chat/Messaging module nằm trong Game Area**, có UX tốt trên mobile, realtime ổn định, state rõ ràng, API/BE contract nhất quán và có thể scale thêm các tính năng messaging về sau mà không làm ảnh hưởng đến Game.
