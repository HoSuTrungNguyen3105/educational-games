User Chat System – FE + BE Specification

1. Tổng quan

Xây dựng hệ thống chat giữa user với nhau dùng xuyên suốt ứng dụng.

Chat cần tồn tại ở 2 context:

Ngoài Game: user có khu vực Chat/Messaging riêng để xem conversation và nhắn tin với nhau.

Trong Game: khi user vào Game Room, chat vẫn khả dụng nhưng được thu gọn thành chat bubble ở phía trên khu vực chơi game. User có thể mở chat mà không rời Game.

Ngoài ra hệ thống sẽ có Authentication / Login, vì chat cần gắn với identity của user.

Mục tiêu là sử dụng chung một messaging backend và message model cho cả hai context, tránh tạo hai hệ thống chat riêng biệt.

2. User Flow

2.1. Authentication – User Login / Register

Open App
   ↓
Login / Register
   ↓
Authenticated User
   ↓
Home / Lobby
   ↓
Chat hoặc Join Game

User chưa đăng nhập:

Có thể xem UI public nếu product cho phép.

Không được gửi message.

Khi muốn sử dụng chat cần đăng nhập.

User đã đăng nhập:

Có identity rõ ràng.

Có thể xem conversation.

Có thể gửi/nhận message.

Có thể tham gia chat trong Game Room.



2.2. User Login

Hệ thống cần có Login dành cho User ở ngoài Game. Đây là tài khoản người chơi/user sử dụng để đăng nhập vào hệ thống, chat với user khác và tham gia Game.

Không có role giáo viên/teacher trong scope này. Authentication hiện tại chỉ tập trung vào User / Player account.

Login Flow

Open App
   ↓
Login
   ↓
Validate Credentials
   ↓
Authenticated User
   ↓
Home / Lobby
   ↓
Chat hoặc Join Game

Login UI

┌────────────────────────────────────────┐
│                 Login                  │
│                                        │
│  Email / Username                      │
│  [____________________________]        │
│                                        │
│  Password                              │
│  [____________________________] 👁     │
│                                        │
│  [            Login             ]      │
│                                        │
│  Forgot password?                      │
│                                        │
│  Don't have an account? Register       │
└────────────────────────────────────────┘

Mobile:

┌───────────────────────────────┐
│            Login              │
│                               │
│ Email / Username              │
│ [_________________________]   │
│                               │
│ Password                      │
│ [_________________________] 👁│
│                               │
│ [          Login          ]   │
│                               │
│ Forgot password?              │
│                               │
│ Don't have an account?        │
│ Register                      │
└───────────────────────────────┘

Login Validation

FE:

Email/username required.

Password required.

Disable submit khi request đang chạy.

Hiển thị loading state.

Hiển thị error rõ ràng khi credentials không hợp lệ.

BE:

Verify user tồn tại.

Verify password hash.

Kiểm tra account status.

Tạo access token/session.

Không trả về password hoặc sensitive credential.

Login API

POST /auth/login

Request:

{
  "identifier": "user@example.com",
  "password": "********"
}

Response thành công:

{
  "user": {
    "id": "user-id",
    "username": "user123",
    "displayName": "User 123"
  },
  "session": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}

Login Error Cases

INVALID_CREDENTIALS
→ Email/username hoặc password không đúng.

ACCOUNT_DISABLED
→ Tài khoản hiện không thể đăng nhập.

RATE_LIMITED
→ Thao tác quá nhanh, vui lòng thử lại.

Không nên expose thông tin khiến attacker dễ dàng biết email/username có tồn tại hay không.

Forgot Password

Có thể triển khai flow:

Forgot Password
      ↓
Enter Email
      ↓
Send Verification / Reset Link
      ↓
Reset Password
      ↓
Login

Nếu product chưa cần Forgot Password ở phase đầu, có thể để P1.

2.2. Register / Sign Up

Ngoài Login, cần có Register ở ngoài Game để user có thể tạo tài khoản trước khi sử dụng các tính năng cần identity như Chat.

Flow:

Open App
   ↓
Register
   ↓
Enter Account Information
   ↓
Validate
   ↓
Create Account
   ↓
Auto Login / Redirect Login
   ↓
Authenticated User

Register UI

Desktop:

┌────────────────────────────────────────┐
│              Create Account            │
│                                        │
│  Username                              │
│  [____________________________]        │
│                                        │
│  Email                                 │
│  [____________________________]        │
│                                        │
│  Password                              │
│  [____________________________] 👁     │
│                                        │
│  Confirm Password                      │
│  [____________________________] 👁     │
│                                        │
│  [        Create Account        ]      │
│                                        │
│  Already have an account? Login        │
└────────────────────────────────────────┘

Mobile:

┌───────────────────────────────┐
│         Create Account        │
│                               │
│ Username                      │
│ [_________________________]   │
│                               │
│ Email                         │
│ [_________________________]   │
│                               │
│ Password                      │
│ [_________________________]   │
│                               │
│ Confirm Password              │
│ [_________________________]   │
│                               │
│ [      Create Account      ]  │
│                               │
│ Already have an account?      │
│ Login                         │
└───────────────────────────────┘

Register Fields

Tối thiểu:

username
email
password
confirmPassword

Có thể bổ sung displayName, avatar, termsAccepted nếu product yêu cầu.

Validation

FE validate khi nhập và khi submit; BE validate lại toàn bộ.

Username: required, length/character policy, unique.

Email: required, valid format, unique.

Password: required, đáp ứng password policy.

Confirm password: phải khớp password.

Register API – BE

POST /auth/register

Request:

{
  "username": "user123",
  "email": "user@example.com",
  "password": "********"
}

Response có thể trả session để auto-login hoặc yêu cầu email verification tùy auth flow.

Register BE Validation

Request
  ↓
Validate schema
  ↓
Normalize data
  ↓
Check username duplicate
  ↓
Check email duplicate
  ↓
Validate password policy
  ↓
Hash password
  ↓
Create user
  ↓
Create session / verification flow

Không lưu plain-text password. Ưu tiên password hashing như Argon2id hoặc cơ chế tương đương theo security standard của project.

Register Error Cases

USERNAME_ALREADY_EXISTS → Username đã được sử dụng.
EMAIL_ALREADY_EXISTS    → Email đã được sử dụng.
INVALID_EMAIL           → Email không hợp lệ.
WEAK_PASSWORD           → Password chưa đáp ứng yêu cầu.
PASSWORD_MISMATCH       → Password xác nhận không khớp.
RATE_LIMITED            → Thao tác quá nhanh, vui lòng thử lại.
UNKNOWN_ERROR           → Có lỗi xảy ra, vui lòng thử lại.

Register UX

Idle
 ↓
Submitting
 ↓
Success / Error

Trong trạng thái submitting cần disable submit button và chống double-submit.

Khi thành công:

Register Success
      ↓
Auto Login
      ↓
Home / Lobby

hoặc chuyển sang email verification nếu product yêu cầu.

Login / Register Navigation

Cho phép chuyển trực tiếp giữa hai flow:

Login
  ↕
Register

Auth State sau Register

Auth Store
├── user
├── accessToken / session
├── isAuthenticated
└── loading

Sau khi register/login thành công:

Authenticated User
       ↓
┌──────┴───────────┐
↓                  ↓
Chat ngoài Game    Join Game
                   ↓
              Game Chat Bubble

Acceptance Criteria – Register

User có thể mở Register từ khu vực ngoài Game.

User có thể chuyển Login ↔ Register.

FE validation đầy đủ.

BE validate lại toàn bộ input.

Username/email duplicate được xử lý.

Password được hash, không lưu plain text.

Submit có loading state và chống duplicate submit.

Error message rõ ràng.

Register success tạo session hoặc chuyển sang email verification theo flow.

Sau khi authenticated, user có thể sử dụng Chat.

Register responsive tốt trên desktop và mobile.

3. Chat ngoài Game

Sau khi login, user có thể truy cập Chat từ navigation chính.

Ví dụ:

┌─────────────────────────────────────────┐
│ Logo    Home    Games    Chat    Profile│
├─────────────────────────────────────────┤
│                                         │
│ Conversations                           │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ User A                         10:25 │ │
│ │ Hello!                              │ │
│ ├─────────────────────────────────────┤ │
│ │ User B                         09:51 │ │
│ │ Are you joining the game?           │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘

Chat ngoài Game cần hỗ trợ:

Danh sách conversation.

Conversation detail.

Search user/conversation nếu cần.

Unread count.

Last message.

Timestamp.

Online/offline nếu có presence.

Send message.

Retry khi send thất bại.

Pagination / load older messages.

Read state.

Realtime message.

4. Chat trong Game

Khi user join Game Room:

┌─────────────────────────────────┐
│ Game                       💬 ① │
├─────────────────────────────────┤
│                                 │
│                                 │
│             GAME                │
│                                 │
│                                 │
│                                 │
└─────────────────────────────────┘

Chat mặc định không mở full panel.

Chỉ hiển thị:

Chat bubble.

Unread badge.

Có thể hiển thị số message chưa đọc.

Click bubble:

┌─────────────────────────────────┐
│ Game                      ✕      │
├─────────────────────────────────┤
│ Chat                            │
│                                 │
│ User A: Hello                   │
│ User B: Hi!                     │
│ User A: Ready?                  │
│                                 │
│─────────────────────────────────│
│ Nhập tin nhắn...          Send  │
└─────────────────────────────────┘

Chat trong Game phải:

Không reload Game.

Không reset Game state.

Không làm mất session.

Không phá layout.

Không tạo horizontal overflow.

Giữ message realtime.

Giữ unread state khi đóng chat.

5. Chat Context

Cần phân biệt rõ các loại conversation.

Conversation
├── Direct Message
│   └── User ↔ User
│
└── Game Room Chat
    └── User ↔ Users trong cùng Game Room

Direct Message

User có thể nhắn riêng cho user khác.

User A ↔ User B

Game Room Chat

User chỉ được chat với thành viên của Game Room hiện tại.

Game Room #123
├── User A
├── User B
├── User C
└── User D

Message gửi trong room chỉ được deliver cho member hợp lệ của room.

6. Shared Messaging Architecture

Không tạo hai backend chat riêng cho:

Chat ngoài Game.

Chat trong Game.

Nên dùng chung messaging infrastructure:

                   Messaging Service
                         │
              ┌──────────┴──────────┐
              ↓                     ↓
       Direct Conversation      Game Conversation
              │                     │
              └──────────┬──────────┘
                         ↓
                      Message
                         ↓
                  Realtime Gateway

FE quyết định context hiển thị message:

Outside Game
→ Full Chat UI

Inside Game
→ Chat Bubble + Overlay / Sheet

7. Authentication

7.1. Login

Authentication cần cung cấp identity cho messaging.

Thông tin user tối thiểu:

type User = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
};

Auth state:

Unauthenticated
      ↓
Login
      ↓
Authenticated
      ↓
Session

BE cần xác thực token/session cho tất cả messaging APIs.

8. FE Architecture

Đề xuất:

features/
├── auth/
│   ├── components/
│   ├── hooks/
│   ├── state/
│   └── services/
│
└── messaging/
    ├── components/
    │   ├── ChatBubble/
    │   ├── ChatPanel/
    │   ├── ConversationList/
    │   ├── ConversationItem/
    │   ├── MessageList/
    │   ├── MessageItem/
    │   ├── MessageInput/
    │   └── UnreadBadge/
    │
    ├── hooks/
    │   ├── useConversations/
    │   ├── useMessages/
    │   ├── useChatRealtime/
    │   ├── useUnreadCount/
    │   └── useTyping/
    │
    ├── state/
    │   ├── messagingStore/
    │   └── selectors/
    │
    ├── services/
    │   ├── conversationApi/
    │   ├── messageApi/
    │   └── realtime/
    │
    └── types/

9. FE Chat Bubble

Chat bubble trong Game cần là một component độc lập:

<ChatBubble
  unreadCount={unreadCount}
  onClick={openChat}
/>

Behavior:

0 unread → bubble bình thường.

> 0 unread → hiển thị badge.

Có message mới → update realtime.

Click → mở ChatPanel.

Close → quay lại bubble.

Không nên để Game component tự quản lý toàn bộ chat logic.

10. Responsive Design

Desktop ngoài Game

┌──────────────┬──────────────────────────┐
│ Conversations│ Conversation             │
│              │                          │
│ User A       │ Messages                 │
│ User B       │                          │
│ User C       │                          │
│              │ Input                    │
└──────────────┴──────────────────────────┘

Mobile ngoài Game

┌───────────────────────────────┐
│ Chat                          │
├───────────────────────────────┤
│ User A                        │
│ Hello                         │
├───────────────────────────────┤
│ User B                        │
│ Are you online?               │
└───────────────────────────────┘

Có thể dùng:

Conversation list → page/screen riêng.

Conversation detail → page/screen riêng.

Back navigation rõ ràng.

Mobile trong Game

Chat mở dạng:

Bottom sheet.

Drawer.

Floating overlay.

Ưu tiên không chiếm toàn bộ Game nếu không cần.

11. Mobile Keyboard

Khi mở chat trên mobile:

┌───────────────────────────────┐
│ Chat                          │
│                               │
│ Messages                      │
│                               │
│                               │
├───────────────────────────────┤
│ Nhập tin nhắn...        Send  │
└───────────────────────────────┘
              Keyboard

Yêu cầu:

Input không bị keyboard che.

Message list tự điều chỉnh chiều cao.

Không tạo layout jump lớn.

Preserve scroll position.

Send được bằng keyboard.

Không làm page scroll bất thường.

12. Message List

Message list cần:

Load message history.

Pagination.

Load older messages khi scroll lên.

Auto-scroll khi đang ở cuối.

Không force-scroll khi user đang đọc message cũ.

Preserve scroll position khi prepend message cũ.

Hiển thị message theo thứ tự server xác nhận.

Nếu số message lớn, cân nhắc virtualization.

13. Message State

Một message nên có trạng thái:

sending
sent
failed

UI:

sending → spinner
sent    → normal
failed  → retry

Retry không được tạo duplicate message.

Nên sử dụng client-generated idempotency key:

{
  clientMessageId: string;
  conversationId: string;
  content: string;
}

14. Read / Unread

Unread phải hoạt động thống nhất ở cả ngoài Game và trong Game.

Ví dụ:

New Message
     ↓
Conversation unread +1
     ↓
Chat bubble unread +1

Khi mở chat:

Open Conversation
      ↓
Mark messages as read
      ↓
Unread = 0

Cần đảm bảo trạng thái đồng bộ giữa:

Conversation list.

Chat bubble.

Chat panel.

Backend.

15. Realtime

Messaging cần realtime.

Flow:

User A
  ↓
Send Message
  ↓
Backend
  ↓
Persist Message
  ↓
Broadcast Event
  ↓
User B / C
  ↓
Update UI

Realtime event nên có:

{
  type: "message.created",
  conversationId: string,
  message: Message
}

Có thể bổ sung:

message.updated
message.deleted
message.read
typing.started
typing.stopped
presence.updated

16. Typing Indicator

Nếu product cần:

User A is typing...

Typing event không nên persist vào database.

Nên xử lý realtime-only:

typing.started
typing.stopped

Có debounce/throttle để tránh spam realtime event.

17. Presence

Có thể hỗ trợ:

Online
Offline
Away

Presence nên là realtime state, không cần update database cho mỗi thay đổi nhỏ.

18. BE Architecture

Đề xuất:

Backend
├── Auth
│   ├── Login
│   ├── Register
│   ├── Refresh Token / Session
│   └── Current User
│
└── Messaging
    ├── Conversations
    ├── Participants
    ├── Messages
    ├── Read State
    ├── Realtime Gateway
    ├── Presence
    └── Typing

19. Database Model

users

users
-----
id
username
display_name
avatar_url
created_at
updated_at

conversations

conversations
-------------
id
type
game_room_id nullable
created_at
updated_at

type:

direct
game_room

conversation_members

conversation_members
--------------------
conversation_id
user_id
joined_at
last_read_message_id
last_read_at

messages

messages
--------
id
conversation_id
sender_id
client_message_id
content
created_at
updated_at
deleted_at nullable

Có thể thêm metadata nếu cần:

reply_to_message_id
attachment_metadata

20. Database Constraints

Cần đảm bảo:

client_message_id có unique scope phù hợp để chống duplicate.

Conversation member có unique constraint.

Message phải reference conversation tồn tại.

Sender phải có quyền gửi message vào conversation.

Game room conversation phải gắn đúng Game Room.

21. API

Auth

POST /auth/login
POST /auth/register
POST /auth/logout
POST /auth/refresh
GET  /auth/me

Conversations

GET  /conversations
POST /conversations
GET  /conversations/:conversationId
GET  /conversations/:conversationId/members

Messages

GET  /conversations/:conversationId/messages
POST /conversations/:conversationId/messages
POST /conversations/:conversationId/read

Pagination có thể dùng cursor:

GET /conversations/:id/messages?cursor=...

22. Game Room Chat API

Khi user join game:

POST /game-rooms/:roomId/chat/join

Hoặc conversation có thể được tạo/quản lý tự động theo Game Room.

Lấy chat:

GET /game-rooms/:roomId/chat

Gửi message:

POST /game-rooms/:roomId/chat/messages

BE phải verify:

Authenticated user
        ↓
Is member of Game Room?
        ↓
Yes → allow
No  → reject

23. Realtime Gateway

Có thể dùng WebSocket / Socket.IO / hệ thống realtime hiện tại của project.

Khi connect:

Authenticated User
      ↓
Realtime Connection
      ↓
Join required channels
      ↓
Receive events

Channels có thể dựa trên:

user:{userId}
conversation:{conversationId}
game-room:{roomId}

Không broadcast message tới user không thuộc conversation/room.

24. Security

BE không được tin tưởng context từ FE.

Ví dụ FE gửi:

{
  "conversationId": "123",
  "content": "hello"
}

BE phải tự validate:

Authenticated?
Conversation exists?
User is member?
Game room membership valid?
Rate limit OK?
Content valid?

Không cho phép FE tự quyết định recipient hoặc room membership.

25. Anti-Spam / Rate Limit

Cần có giới hạn:

Messages / second.

Messages / minute.

Maximum message length.

Maximum payload size.

Ví dụ:

MAX_MESSAGE_LENGTH = 2000

Giá trị cuối cùng tùy product.

Có thể throttle theo:

userId
IP
conversationId

26. Message Ordering

Backend cần đảm bảo thứ tự message ổn định.

Không chỉ dựa vào timestamp từ client.

Nên dùng:

Server timestamp.

Database ordering.

Message sequence nếu cần.

FE render theo server ordering.

27. Reconnect

Realtime connection có thể bị mất.

FE cần:

Connected
Disconnected
Reconnecting
Connected

Sau khi reconnect:

Reconnect socket.

Rejoin channels.

Sync message/read state nếu cần.

Không duplicate message.

28. Error Handling

Các trường hợp:

Network Error
Unauthorized
Forbidden
Conversation Not Found
Game Room Closed
Rate Limited
Message Send Failed
Realtime Disconnected

FE phải có feedback rõ ràng.

Đối với send fail:

Message
  ↓
Failed
  ↓
Retry

29. Permission khi rời Game

Nếu user rời Game Room:

Leave Game
   ↓
Remove Game Chat Access

User không còn gửi message vào Game Room đó.

Tùy requirement, lịch sử chat có thể:

Không còn truy cập.

Chỉ đọc.

Vẫn truy cập nếu user còn quyền.

BE cần define rule rõ ràng.

30. FE / BE Responsibilities

FE

FE chịu trách nhiệm:

Login UI.

Auth state.

Chat UI.

Chat bubble.

Conversation list.

Message list.

Message input.

Unread badge.

Typing indicator.

Presence UI.

Responsive behavior.

Realtime subscription.

Retry UX.

Optimistic message UX.

BE

BE chịu trách nhiệm:

Authentication.

Authorization.

Conversation management.

Game room membership validation.

Message persistence.

Message ordering.

Read state persistence.

Realtime delivery.

Rate limiting.

Idempotency.

Security.

Pagination.

31. Acceptance Criteria

Authentication

User có thể register/login.

Session/token hoạt động ổn định.

User identity được sử dụng cho messaging.

Unauthorized user không thể gửi message.

Chat ngoài Game

User có thể mở Chat từ app.

Có conversation list.

Có conversation detail.

User-to-user messaging hoạt động.

Message realtime.

Unread count chính xác.

Read state được đồng bộ.

Pagination hoạt động.

Chat trong Game

Khi vào Game có chat bubble ở top.

Chat bubble không che gameplay.

Có unread badge.

Click bubble mở chat.

Đóng chat không ảnh hưởng Game.

User trong Game Room có thể chat với nhau realtime.

Không cần mở màn hình Chat riêng để gửi message.

Mobile

Chat ngoài Game responsive.

Chat trong Game responsive.

Portrait hoạt động.

Landscape hoạt động.

Keyboard không che input.

Không horizontal overflow.

Chat overlay/sheet không phá Game layout.

Safe area được xử lý.

Backend

Message được persist.

Có authorization theo conversation.

Game Room membership được validate.

Có idempotency chống duplicate.

Có pagination.

Có realtime delivery.

Có rate limit.

Có reconnect handling.

Không leak message tới user không có quyền.

32. Recommended Delivery Phases

Phase 1 – Authentication

Login/Register.

Session management.

Current user.

Auth middleware.

Phase 2 – Core Messaging

Conversation model.

Message model.

Send / receive message.

Message history.

Pagination.

Phase 3 – Realtime

WebSocket / Socket.

Realtime message delivery.

Read state.

Unread count.

Reconnect.

Phase 4 – External Chat UI

Chat navigation.

Conversation list.

Message screen.

Input.

Responsive mobile.

Phase 5 – Game Chat

Chat bubble.

Unread badge.

Game Room conversation.

Overlay / Drawer / Bottom Sheet.

Mobile keyboard behavior.

Phase 6 – Polish

Typing indicator.

Presence.

Retry.

Performance.

Rate limit.

Edge cases.

33. Final UX

Outside Game

Login
  ↓
Home
  ↓
Chat
  ↓
Conversation
  ↓
User ↔ User

Inside Game

Login
  ↓
Join Game
  ↓
Game Room
  ↓
       💬
       ↑
   Chat Bubble
       ↓
Open Chat
       ↓
Users trong Game Room
       ↕
    Messages

Mục tiêu cuối cùng là tạo một hệ thống messaging thống nhất: user có thể chat với nhau khi ở ngoài Game, và khi vào Game thì vẫn tiếp tục sử dụng chính hệ thống đó thông qua chat bubble ở phía trên khu vực chơi game, thay vì phải chuyển sang một màn hình chat riêng.