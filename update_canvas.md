# Tối ưu Canvas Game Builder thành hệ thống Game Template linh hoạt

## 1. Mục tiêu

Tối ưu lại hệ thống Canvas hiện tại để có thể xây dựng và tùy chỉnh **nhiều loại trò chơi khác nhau** trên cùng một Game Builder.

Canvas không được thiết kế cứng cho một game cụ thể. Giáo viên phải có thể:

* Chọn một loại game/template có sẵn.
* Tùy chỉnh giao diện, bố cục, màu sắc, hình ảnh, text, button, background...
* Tùy chỉnh các thành phần riêng của từng loại game.
* Tùy chỉnh vị trí, kích thước, font, màu, animation của từng element.
* Có thể thêm/xóa/thay đổi element nếu template cho phép.
* Preview game ngay trong Builder.
* Lưu toàn bộ thiết kế thành `game.design`.
* Runtime sử dụng chính thiết kế đó để render game cho học sinh.

Hệ thống cần có kiến trúc đủ linh hoạt để sau này có thể thêm nhiều game/template mới mà **không phải sửa lại Canvas core**.

---

# 2. Canvas hiện tại

## Game Builder

File chính:

```text
src/components/gameBuilder/GameBuilder.jsx
src/components/gameBuilder/CanvasArea.jsx
```

Route:

```text
#/admin/builder/:id?
```

Đây là màn hình giáo viên thiết kế game.

Canvas hiện tại hỗ trợ:

* Kéo thả element.
* Zoom.
* Thiết kế layout.
* Preview.

---

## Preview

Nằm trong:

```text
GameBuilder.jsx
```

Thông qua:

```text
PreviewModal
```

Preview render runtime thu nhỏ và sử dụng scale-to-fit.

Preview phải đảm bảo render gần như giống với runtime thật.

---

## Runtime game

File:

```text
src/games/CustomDesignPlayScreen.jsx
```

Route:

```text
#/play/:id
```

Được sử dụng khi:

```js
game.design
```

tồn tại.

GamePlayRouter sẽ đưa game có `game.design` vào:

```text
CustomDesignPlayScreen
```

Canvas runtime hỗ trợ:

* Scale-to-fit.
* Upscale tối đa 2×.
* Render game thiết kế.

---

## Component render dùng chung

File:

```text
src/games/TemplateRenderer.jsx
```

Đây là component quan trọng dùng để render:

```text
template.canvas
template.elements
```

Component này đang được sử dụng bởi:

1. Game Builder
2. Preview
3. CustomDesignPlayScreen

Do đó cần giữ nguyên nguyên tắc:

> Builder, Preview và Runtime phải sử dụng cùng một cấu trúc template/render để tránh tình trạng thiết kế trên Builder khác với lúc học sinh chơi.

---

# 3. Phân biệt game Canvas và game thường

Không phải tất cả game đều sử dụng Canvas.

Các game hiện tại như:

```text
SnailRace
LuckyWheel
SpaceShip
...
```

được xử lý riêng thông qua:

```text
GamePlayRouter
```

Chỉ những game có:

```js
game.design
```

mới sử dụng:

```text
CustomDesignPlayScreen
```

và:

```text
TemplateRenderer
```

Không được làm ảnh hưởng hoặc phá vỡ các game runtime hiện tại.

---

# 4. Kiến trúc Game Template mới

Cần xây dựng hệ thống theo hướng:

```text
Game Type
    ↓
Game Template
    ↓
Canvas
    ↓
Elements
    ↓
Game Configuration
    ↓
Questions / Data
    ↓
Runtime
```

Ví dụ:

```text
Đuổi Hình Bắt Chữ
    ↓
Template: duoi-hinh-bat-chu
    ↓
Canvas layout
    ↓
Image + Answer + Question + Timer + Score...
    ↓
Game config
    ↓
Question API
    ↓
Runtime
```

---

# 5. Template không được chứa dữ liệu câu hỏi cố định

Template chỉ nên định nghĩa:

* Giao diện.
* Layout.
* Các element.
* Component game.
* Cấu hình hiển thị.
* Các vùng dữ liệu động.
* Các interaction được phép.

Không hard-code danh sách câu hỏi vào template.

Ví dụ:

```json
{
  "templateId": "duoi-hinh-bat-chu",
  "name": "Đuổi Hình Bắt Chữ",
  "version": 1,
  "canvas": {},
  "elements": [],
  "gameConfig": {}
}
```

Câu hỏi nên được lấy từ API/data riêng.

---

# 6. Hỗ trợ Game Template từ API

Cần thiết kế API riêng cho hệ thống template game.

Ví dụ:

```text
GET    /game-templates
GET    /game-templates/:id
POST   /game-templates
PUT    /game-templates/:id
DELETE /game-templates/:id
```

Template API có thể trả về:

```json
{
  "id": "duoi-hinh-bat-chu",
  "name": "Đuổi Hình Bắt Chữ",
  "slug": "duoi-hinh-bat-chu",
  "type": "canvas",
  "version": 1,
  "canvas": {},
  "elements": [],
  "gameConfig": {},
  "customizable": {}
}
```

Không bắt buộc phải chuyển toàn bộ game hiện tại sang API ngay lập tức.

Có thể hỗ trợ cả:

```text
Template có sẵn trong frontend
+
Template lấy từ API
```

Sau này có thể chuyển dần sang API.

---

# 7. Template phải có khả năng định nghĩa những gì được tùy chỉnh

Mỗi template cần có metadata cho biết giáo viên được phép chỉnh sửa phần nào.

Ví dụ:

```json
{
  "customizable": {
    "background": true,
    "text": true,
    "images": true,
    "colors": true,
    "font": true,
    "position": true,
    "size": true,
    "animation": true,
    "timer": true,
    "score": true,
    "question": true,
    "answer": true
  }
}
```

Hoặc chi tiết hơn theo từng element:

```json
{
  "elementId": "question-image",
  "editable": {
    "position": true,
    "size": true,
    "image": true,
    "opacity": true,
    "animation": true
  }
}
```

Mục tiêu là không để Canvas Builder phải biết logic riêng của từng game.

---

# 8. Các loại Element trên Canvas

Canvas nên hỗ trợ hệ thống element generic.

Ví dụ:

```text
Text
Image
Shape
Button
Container
Background
Icon
Video
Timer
Score
Question
Answer
Progress
Game-specific Component
```

Mỗi element có thể có:

```json
{
  "id": "element-1",
  "type": "text",
  "x": 100,
  "y": 100,
  "width": 300,
  "height": 60,
  "rotation": 0,
  "style": {},
  "content": {},
  "animation": {},
  "responsive": {}
}
```

Không nên tạo một component Canvas riêng cho từng game nếu element đó có thể dùng chung.

---

# 9. Game-specific Component

Một số game cần component đặc biệt.

Ví dụ Đuổi Hình Bắt Chữ:

```text
QuestionImage
AnswerInput
AnswerOptions
Hint
Timer
Score
```

Template có thể khai báo:

```json
{
  "type": "game-component",
  "component": "QuestionImage"
}
```

Canvas core chỉ cần biết đây là một game component.

Logic cụ thể nằm trong component/template handler.

Ví dụ:

```text
Canvas Core
    ↓
Game Component Registry
    ↓
QuestionImage
AnswerOptions
Timer
Score
...
```

Như vậy khi thêm game mới có thể đăng ký component mới mà không sửa toàn bộ Canvas.

---

# 10. Template Registry

Nên có cơ chế Registry để đăng ký các game template.

Ví dụ:

```js
gameTemplateRegistry.register({
  id: "duoi-hinh-bat-chu",
  renderer: DuoiHinhBatChuRenderer,
  components: [...]
});
```

Template có thể đến từ:

```text
Frontend Registry
hoặc
API
```

Nếu API trả về template mới nhưng frontend chưa có component đặc biệt thì phải có cơ chế fallback hoặc báo template chưa được hỗ trợ.

---

# 11. Canvas Builder UI

Game Builder nên được chia thành các khu vực rõ ràng:

```text
┌──────────────────────────────────────────────┐
│ Toolbar                                      │
├─────────────┬──────────────────┬─────────────┤
│ Elements    │                  │ Properties  │
│ / Template  │      Canvas     │             │
│             │                  │             │
│             │                  │             │
├─────────────┴──────────────────┴─────────────┤
│ Bottom toolbar / Zoom / Preview / Save       │
└──────────────────────────────────────────────┘
```

---

# 12. Template Selector

Khi tạo game mới:

```text
Chọn loại trò chơi

[ Đuổi Hình Bắt Chữ ]
[ Trắc Nghiệm ]
[ Đúng / Sai ]
[ Ghép Đôi ]
[ Ô Chữ ]
[ Vòng Quay ]
[ ... ]
```

Sau khi chọn template:

```text
Template
    ↓
Load template definition
    ↓
Create game.design
    ↓
Open Canvas Builder
```

---

# 13. Properties Panel

Khi click vào element trên Canvas, Properties Panel phải tự động hiển thị các thuộc tính mà element/template cho phép chỉnh sửa.

Ví dụ:

```text
Position
X
Y

Size
Width
Height

Style
Font
Font Size
Font Weight
Color
Background
Border
Radius
Shadow
Opacity

Transform
Rotation

Animation
Type
Duration
Delay

Responsive
Desktop
Tablet
Mobile
```

Không hiển thị các option không được template cho phép.

---

# 14. Responsive Canvas

Canvas phải hỗ trợ responsive.

Không nên chỉ lưu một vị trí tuyệt đối duy nhất.

Có thể hỗ trợ:

```json
{
  "responsive": {
    "desktop": {
      "x": 100,
      "y": 100,
      "width": 500
    },
    "tablet": {
      "x": 50,
      "y": 80,
      "width": 400
    },
    "mobile": {
      "x": 20,
      "y": 50,
      "width": 300
    }
  }
}
```

Nếu không có cấu hình riêng cho mobile/tablet thì tự động scale từ desktop.

---

# 15. Layer Management

Canvas cần hỗ trợ:

```text
Bring to front
Send to back
Bring forward
Send backward
```

và có thể quản lý:

```text
Layers
├── Background
├── Decoration
├── Question
├── Answer
├── Timer
└── Score
```

Có thể khóa element:

```text
Lock
Hide
```

---

# 16. Group Element

Cho phép group nhiều element:

```text
Group
    ├── Image
    ├── Text
    └── Decoration
```

Khi di chuyển group thì các element bên trong di chuyển theo.

---

# 17. Undo / Redo

Canvas Builder cần có:

```text
Undo
Redo
```

Có thể sử dụng history state thay vì tự lưu toàn bộ game sau mỗi thao tác.

Không được để mỗi lần drag element lại gọi API.

---

# 18. Auto Save

Thiết kế nên có:

```text
Local state
    ↓
Debounce
    ↓
Save API
```

Không save server liên tục trong lúc kéo element.

Ví dụ debounce:

```text
500ms - 1500ms
```

Có trạng thái:

```text
Saving...
Saved
Unsaved changes
```

---

# 19. Data API của game

Ví dụ hiện tại đã có game:

```text
Đuổi Hình Bắt Chữ
```

và câu hỏi đã có trong Data API.

Không nên copy câu hỏi vào Canvas template.

Nên tách:

```text
Game Template
    ↓
Game Design
    ↓
Game Data
```

Ví dụ:

```text
Template:
duoi-hinh-bat-chu

Design:
background
question position
image position
answer style
timer position
...

Game Data:
question 1
question 2
question 3
...
```

Runtime kết hợp cả hai.

---

# 20. Cho phép chọn nguồn dữ liệu

Game template có thể định nghĩa data source:

```text
API
Existing Game Data
Question Bank
Manual Input
Imported Data
```

Ví dụ:

```text
Đuổi Hình Bắt Chữ
    ↓
Question Source
    ├── Bộ câu hỏi có sẵn
    ├── Question Bank
    ├── API
    └── Import Excel/Word
```

Canvas không chịu trách nhiệm xử lý toàn bộ dữ liệu câu hỏi.

Nó chỉ cần biết game component cần dữ liệu gì.

---

# 21. Import câu hỏi

Hệ thống nên được thiết kế để sau này hỗ trợ:

```text
Import Excel
Import Word
Import CSV
```

Ví dụ dữ liệu:

```text
Question
Image
Answer
Hint
Time
```

Sau khi import:

```text
File
 ↓
Parser
 ↓
Validate
 ↓
Question Bank
 ↓
Game Data
```

Không đưa logic import trực tiếp vào Canvas Renderer.

---

# 22. Template versioning

Template cần có version:

```json
{
  "templateId": "duoi-hinh-bat-chu",
  "version": 2
}
```

Khi template thay đổi:

```text
v1
v2
v3
```

Các game cũ vẫn phải chạy được.

Không được tự động phá `game.design` cũ khi template được cập nhật.

---

# 23. Data Model đề xuất

Game:

```json
{
  "id": "game-123",
  "type": "canvas",
  "templateId": "duoi-hinh-bat-chu",
  "templateVersion": 1,
  "design": {},
  "gameConfig": {},
  "dataSource": {}
}
```

Template:

```json
{
  "id": "duoi-hinh-bat-chu",
  "name": "Đuổi Hình Bắt Chữ",
  "slug": "duoi-hinh-bat-chu",
  "type": "canvas",
  "version": 1,
  "canvas": {},
  "elements": [],
  "gameConfig": {},
  "customizable": {},
  "components": []
}
```

---

# 24. Template và Design phải tách biệt

Đây là nguyên tắc quan trọng.

```text
Template
```

là mẫu gốc.

```text
Design
```

là bản giáo viên đã chỉnh sửa.

Ví dụ:

```text
Template:
Đuổi Hình Bắt Chữ mặc định
        ↓
Teacher customize
        ↓
Game Design
        ↓
Save
```

Không sửa trực tiếp template gốc khi giáo viên chỉnh game.

---

# 25. Template có thể có Default Design

Template có thể cung cấp:

```text
defaultCanvas
defaultElements
defaultGameConfig
```

Khi tạo game:

```text
Template
 ↓
Clone default design
 ↓
Game.design
```

Sau đó giáo viên tùy chỉnh bản clone.

---

# 26. Runtime

`CustomDesignPlayScreen.jsx` cần nhận:

```text
game
template
design
gameData
```

Sau đó:

```text
GamePlayRouter
    ↓
CustomDesignPlayScreen
    ↓
TemplateRenderer
    ↓
Template Components
    ↓
Game Data
```

Runtime không được phụ thuộc vào state của Builder.

Game đã lưu phải có thể chạy độc lập.

---

# 27. TemplateRenderer

Cần refactor `TemplateRenderer.jsx` thành renderer generic.

Nhiệm vụ:

```text
TemplateRenderer
├── Render canvas
├── Render elements
├── Render generic elements
├── Render registered game components
├── Apply styles
├── Apply responsive
├── Apply animation
└── Handle runtime mode
```

Không nhúng logic riêng của Đuổi Hình Bắt Chữ trực tiếp vào `TemplateRenderer`.

---

# 28. Builder Mode và Runtime Mode

`TemplateRenderer` nên hỗ trợ:

```js
mode="builder"
```

và:

```js
mode="preview"
```

và:

```js
mode="runtime"
```

Builder:

```text
drag
resize
select
edit
```

Preview:

```text
interactive nhưng không chỉnh layout
```

Runtime:

```text
gameplay thật
```

Có thể dùng chung renderer nhưng khác interaction layer.

---

# 29. Performance

Canvas Builder phải tối ưu để không bị lag khi có nhiều element.

Không nên:

* Re-render toàn bộ Canvas khi kéo một element.
* Gọi API mỗi lần thay đổi position.
* Tạo object mới không cần thiết cho toàn bộ design.
* Render game logic khi chỉ thay đổi UI property.

Nên:

* Memoization.
* Local state cho interaction.
* Debounce save.
* Chỉ update element đang thao tác.
* Tách Builder state và Runtime state.

---

# 30. Tương thích với hệ thống game hiện tại

Không được phá các game đang chạy:

```text
SnailRace
LuckyWheel
SpaceShip
...
```

GamePlayRouter vẫn phải xử lý:

```text
game.design
```

và các game runtime truyền thống như hiện tại.

Chỉ refactor phần:

```text
Canvas Game
```

---

# 31. Mục tiêu cuối cùng

Sau khi hoàn thành, hệ thống phải đạt kiến trúc:

```text
                    ┌────────────────────┐
                    │   Game Templates   │
                    │                    │
                    │ API / Registry     │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │   Game Builder     │
                    │                    │
                    │ CanvasArea         │
                    │ Properties         │
                    │ Layers             │
                    │ Responsive         │
                    └─────────┬──────────┘
                              │
                              ▼
                       game.design
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
          PreviewModal             CustomDesignPlayScreen
                 │                         │
                 └────────────┬────────────┘
                              ▼
                     TemplateRenderer
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
          Generic Elements          Game Components
                                      │
                                      ▼
                                  Game Data API
```

---

# 32. Yêu cầu triển khai

Trước khi code:

1. Đọc toàn bộ các file liên quan:

   * `GameBuilder.jsx`
   * `CanvasArea.jsx`
   * `TemplateRenderer.jsx`
   * `CustomDesignPlayScreen.jsx`
   * `GamePlayRouter`
   * Các model/API hiện tại liên quan đến game design/template.

2. Phân tích cấu trúc `game.design` hiện tại.

3. Không tự ý phá format data đang được lưu nếu chưa cần thiết.

4. Ưu tiên backward compatibility.

5. Nếu cần thay đổi schema thì tạo migration/adapter để game cũ vẫn chạy.

6. Tách rõ:

   * Canvas Core
   * Template
   * Design
   * Game Component
   * Game Data
   * Runtime

7. Không hard-code riêng cho Đuổi Hình Bắt Chữ trong Canvas core.

8. Thiết kế sao cho khi muốn thêm game mới chỉ cần:

   * Tạo template.
   * Khai báo customizable properties.
   * Đăng ký game components nếu cần.
   * Khai báo data source.
   * Không phải viết lại Canvas Builder.

---

# 33. Tiêu chí hoàn thành

Hệ thống được xem là đạt khi:

* Có thể chọn nhiều Game Template.
* Template có thể lấy từ API hoặc registry.
* Giáo viên có thể chỉnh Canvas bằng drag/drop.
* Có Properties Panel động theo template/element.
* Có resize, position, layer, group.
* Có responsive desktop/tablet/mobile.
* Có undo/redo.
* Có preview.
* Có auto-save.
* `game.design` lưu độc lập với template gốc.
* Template có version.
* Runtime render đúng thiết kế đã lưu.
* TemplateRenderer dùng chung cho Builder/Preview/Runtime.
* Có thể sử dụng dữ liệu câu hỏi từ API hiện tại.
* Có kiến trúc mở để sau này thêm Question Bank, Import Excel/Word.
* Không ảnh hưởng các game không sử dụng Canvas.
* Không hard-code logic của từng game vào Canvas core.

## Nguyên tắc quan trọng nhất

> **Canvas là một Game Builder Engine, không phải một Canvas riêng cho từng game.**

Mọi game có thiết kế Canvas phải có thể sử dụng chung hệ thống Canvas/Template/Renderer và chỉ khác nhau ở **Template + Game Components + Game Data**.
