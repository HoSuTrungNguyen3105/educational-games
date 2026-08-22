# GAME_TEMPLATE_API_STRUCTURE

# Cấu trúc Game API & Template API

## 1. Mục tiêu

Hệ thống game sử dụng 2 collection chính:

```text
templates
games
Ngoài ra hệ thống hiện có collection:

questions
players
results
users
categories
subjects

Tài liệu này tập trung vào:

Template API
Game API

Không đưa Question API vào kiến trúc chính của tài liệu.

2. Nguyên tắc kiến trúc
Template chịu trách nhiệm

Template lưu toàn bộ giao diện và logic game:

HTML
CSS
JavaScript

Tất cả được lưu trong:

htmlTemplate

Không tách thành:

cssTemplate
jsTemplate
Game chịu trách nhiệm

Game lưu thông tin của một Game cụ thể và tham chiếu đến Template:

Game
  ↓
templateId
  ↓
Template

Game KHÔNG lưu lại:

htmlTemplate
3. Kiến trúc tổng quan
                         ADMIN DASHBOARD
                                │
                                ↓
                       ┌────────────────┐
                       │  Template API  │
                       └────────────────┘
                                │
                                ↓
                         htmlTemplate
                       HTML + CSS + JS
                                │
                                ↓
                            MongoDB
                                │
                                │ templateId
                                ↓
                       ┌────────────────┐
                       │    Game API    │
                       └────────────────┘
                                │
                                ↓
                            Frontend
                                │
                                ↓
                       Dynamic Renderer
                                │
                    ┌───────────┴───────────┐
                    ↓                       ↓
             play-to-learn             play-to-win
                    │                       │
                    ↓                       ↓
          dữ liệu câu hỏi riêng       Template HTML
                                      + CSS + JS
4. MongoDB ObjectId

MongoDB đã tự tạo:

_id

cho mỗi document.

Vì vậy hệ thống KHÔNG tạo thêm:

id

riêng.

Không dùng:

{
  "id": "game-001"
}

Mà dùng:

{
  "_id": "ObjectId(...)"
}
5. Quan hệ giữa các collection
Template → Game

Game tham chiếu Template thông qua:

templateId

templateId chứa _id của document trong collection templates.

templates
    │
    │ _id
    │
    ↓
games.templateId
Game → Questions

Collection questions sử dụng:

gameId

để tham chiếu _id của Game.

games
    │
    │ _id
    │
    ↓
questions.gameId

Phần Question API không thuộc phạm vi chính của tài liệu này.

6. TEMPLATE COLLECTION

Collection:

templates

Schema cuối cùng:

templates: {
  $jsonSchema: {
    bsonType: "object",

    required: [
      "name",
      "description",
      "type",
      "category",
      "icon",
      "ring",
      "htmlTemplate",
      "status"
    ],

    properties: {
      name: {
        bsonType: "string"
      },

      description: {
        bsonType: "string"
      },

      type: {
        enum: [
          "play-to-learn",
          "play-to-win"
        ]
      },

      category: {
        bsonType: "string"
      },

      icon: {
        bsonType: "string"
      },

      ring: {
        bsonType: "string"
      },

      htmlTemplate: {
        bsonType: "string"
      },

      thumbnail: {
        bsonType: "string"
      },

      version: {
        bsonType: "int"
      },

      status: {
        enum: [
          "published",
          "draft",
          "inactive"
        ]
      },

      createdAt: {
        bsonType: "string"
      },

      updatedAt: {
        bsonType: "string"
      }
    }
  }
}
7. Giải thích Template fields
_id

MongoDB tự tạo.

Ví dụ:

{
  "_id": "ObjectId('...')"
}

Không cần tạo:

id
name

Tên Template.

Ví dụ:

Đường Đua Ốc Sên
description

Mô tả Template.

Ví dụ:

Trả lời đúng để ốc sên tiến về đích
type

Phân biệt mục đích của Template:

play-to-learn
play-to-win
play-to-learn

Template phục vụ các Game có nội dung học tập.

Ví dụ:

Quiz
Đúng / Sai
Điền đáp án
Ghép đáp án
play-to-win

Template phục vụ Game giải trí.

Ví dụ:

Puzzle
Racing
Arcade
Board Game
8. category

Phân loại thể loại Game.

Ví dụ:

quiz
puzzle
racing
board
arcade
memory

category khác với type.

Ví dụ:

{
  "type": "play-to-win",
  "category": "puzzle"
}

Có nghĩa:

Mục đích:
Game giải trí

Thể loại:
Game giải đố
9. icon

Icon hiển thị trên Game Card.

Ví dụ:

{
  "icon": "🐌"
}
10. ring

Màu trang trí của Game Card.

Ví dụ:

{
  "ring": "#E4572E"
}
11. htmlTemplate

Đây là field quan trọng nhất của Template.

htmlTemplate chứa toàn bộ:

HTML
CSS
JavaScript

Ví dụ:

{
  "htmlTemplate": "<!DOCTYPE html>\n<html lang=\"vi\">\n<head>\n<style>\n...\n</style>\n</head>\n<body>\n...\n<script>\n...\n</script>\n</body>\n</html>"
}

Không cần:

cssTemplate
jsTemplate
12. thumbnail

Ảnh preview của Template.

Ví dụ:

{
  "thumbnail": "/uploads/templates/snail-race.png"
}

Nếu hệ thống không sử dụng ảnh preview thì có thể bỏ field này.

13. version

Version của Template.

Ví dụ:

version: 1

Khi Admin sửa Template:

version 1
    ↓
Admin sửa HTML
    ↓
version 2
14. status

Trạng thái Template:

published
draft
inactive

Ý nghĩa:

draft
    ↓
Đang tạo/chưa public

published
    ↓
Đang sử dụng

inactive
    ↓
Không cho sử dụng mới
15. createdAt

Thời điểm tạo Template.

16. updatedAt

Thời điểm cập nhật Template.

17. GAME COLLECTION

Collection:

games

Schema cuối cùng:

games: {
  $jsonSchema: {
    bsonType: "object",

    required: [
      "name",
      "description",
      "subject",
      "topic",
      "language",
      "templateId",
      "type",
      "status",
      "questionsCount",
      "playersCount",
      "code"
    ],

    properties: {
      name: {
        bsonType: "string"
      },

      description: {
        bsonType: "string"
      },

      subject: {
        bsonType: "string"
      },

      topic: {
        bsonType: "string"
      },

      language: {
        bsonType: "string"
      },

      templateId: {
        bsonType: "objectId"
      },

      type: {
        enum: [
          "play-to-learn",
          "play-to-win"
        ]
      },

      status: {
        enum: [
          "published",
          "draft"
        ]
      },

      questionsCount: {
        bsonType: "int"
      },

      playersCount: {
        bsonType: "int"
      },

      code: {
        bsonType: "string"
      },

      createdAt: {
        bsonType: "string"
      },

      updatedAt: {
        bsonType: "string"
      }
    }
  }
}
18. Giải thích Game fields
_id

MongoDB tự tạo.

Không tạo thêm:

id
19. name

Tên Game.

Ví dụ:

Toán lớp 3

Đã thống nhất sử dụng:

name

thay vì:

title
20. description

Mô tả Game.

21. subject

Môn học.

Ví dụ:

Toán
Tiếng Việt
Tiếng Anh
Khoa học

Field này chủ yếu có ý nghĩa với:

play-to-learn
22. topic

Chủ đề học tập.

Ví dụ:

Phép cộng
Phép trừ
Từ vựng
Động vật
23. language

Ngôn ngữ của Game.

Ví dụ:

vi
en
24. templateId

ID của Template mà Game sử dụng.

Đây là:

templates._id

được tham chiếu bởi:

games.templateId

Kiểu dữ liệu:

bsonType: "objectId"

Ví dụ:

{
  "templateId": "ObjectId('...')"
}
25. type

Loại Game:

play-to-learn
play-to-win

Giữ type ở Game để frontend/backend có thể phân loại Game trực tiếp mà không cần lấy Template trước.

26. status

Trạng thái Game:

published
draft
27. questionsCount

Số lượng câu hỏi của Game.

Ví dụ:

{
  "questionsCount": 20
}

Field này có thể được dùng làm counter/cache để không phải lấy toàn bộ câu hỏi chỉ để hiển thị số lượng.

28. playersCount

Số lượng người đã chơi Game.

Ví dụ:

{
  "playersCount": 1250
}

Có thể dùng để hiển thị thống kê trên Game Card.

29. code

Mã tham gia Game.

Ví dụ:

TOAN3
GAME123
ABC456

Nếu hệ thống không sử dụng mã tham gia thì có thể xóa field này.

30. createdAt

Thời điểm tạo Game.

31. updatedAt

Thời điểm cập nhật Game.

32. TEMPLATE API
Lấy danh sách Template
GET /api/templates
Lấy Template
GET /api/templates/:id

id trên URL ở đây chính là MongoDB _id.

Ví dụ:

GET /api/templates/66c123...
Tạo Template
POST /api/templates

Body:

{
  "name": "Đường Đua Ốc Sên",

  "description": "Trả lời đúng để ốc sên tiến về đích",

  "type": "play-to-learn",

  "category": "quiz",

  "icon": "🐌",

  "ring": "#E4572E",

  "htmlTemplate": "<!DOCTYPE html>...",

  "thumbnail": "/uploads/snail-race.png",

  "version": 1,

  "status": "published"
}

MongoDB tự tạo:

_id
33. Cập nhật Template
PUT /api/templates/:id

Có thể cập nhật:

name
description
type
category
icon
ring
htmlTemplate
thumbnail
version
status

Không cần cập nhật:

_id
34. Xóa Template
DELETE /api/templates/:id

Trước khi xóa cần kiểm tra Template có đang được Game sử dụng hay không.

Nếu đang được sử dụng:

status = inactive

sẽ an toàn hơn xóa cứng.

35. GAME API
Lấy danh sách Game
GET /api/games
Lấy Game
GET /api/games/:id
Tạo Game
POST /api/games

Ví dụ:

{
  "name": "Toán lớp 3",

  "description": "Luyện phép cộng",

  "subject": "Toán",

  "topic": "Phép cộng",

  "language": "vi",

  "templateId": "ObjectId('...')",

  "type": "play-to-learn",

  "status": "published",

  "questionsCount": 20,

  "playersCount": 0,

  "code": "TOAN3"
}
36. Cập nhật Game
PUT /api/games/:id

Có thể cập nhật:

name
description
subject
topic
language
templateId
type
status
questionsCount
playersCount
code
37. Xóa Game
DELETE /api/games/:id
38. Play-to-Learn

Ví dụ:

{
  "name": "Toán lớp 3",

  "type": "play-to-learn",

  "templateId": "ObjectId('...')",

  "subject": "Toán",

  "topic": "Phép cộng"
}

Flow:

Game
 ↓
templateId
 ↓
Template
 ↓
htmlTemplate
 ↓
Render Game

+

Dữ liệu câu hỏi từ hệ thống riêng

Game API không lưu trực tiếp nội dung câu hỏi.

39. Play-to-Win

Ví dụ:

{
  "name": "Block Master",

  "type": "play-to-win",

  "templateId": "ObjectId('...')"
}

Flow:

Game
 ↓
templateId
 ↓
Template
 ↓
htmlTemplate
 ↓
HTML + CSS + JavaScript
 ↓
Game chạy

Không cần câu hỏi.

40. Không lưu HTML trong Game

KHÔNG làm:

{
  "name": "Block Master",

  "templateId": "ObjectId('...')",

  "htmlTemplate": "<!DOCTYPE html>..."
}

Đúng:

{
  "name": "Block Master",

  "templateId": "ObjectId('...')
}

HTML nằm duy nhất ở:

templates.htmlTemplate
41. Dynamic Game Renderer

Frontend chỉ cần một Renderer chung.

Ví dụ:

<DynamicGameRenderer
  game={game}
  template={template}
/>

Flow:

Game
 ↓
templateId
 ↓
GET Template
 ↓
htmlTemplate
 ↓
DynamicGameRenderer
 ↓
Game

Không cần tạo React component riêng cho từng Game Template.

42. Admin thêm Template

Admin Dashboard:

Admin Dashboard
       ↓
Templates
       ↓
Thêm Template
       ↓
Nhập HTML
       ↓
HTML + CSS + JS
       ↓
POST /api/templates
       ↓
MongoDB

Sau khi lưu, frontend có thể lấy Template mới từ API.

Không cần:

tạo React component

Không cần:

sửa App.jsx

Không cần:

build lại game component
43. Admin sửa Template

Ví dụ:

Template:
Đường Đua Ốc Sên

Admin sửa:

htmlTemplate

Sau đó:

PUT /api/templates/:id

Các Game đang sử dụng Template đó sẽ lấy Template mới.

Game A ─┐
Game B ─┼──→ Template Snail Race
Game C ─┘
              ↓
         Admin sửa HTML
              ↓
         Template mới
              ↓
        A / B / C dùng mới
44. Không duplicate HTML

Không được:

Game A
 └── htmlTemplate

Game B
 └── htmlTemplate

Game C
 └── htmlTemplate

Đúng:

Template
 └── htmlTemplate

Game A
 └── templateId

Game B
 └── templateId

Game C
 └── templateId
45. Những field ĐÃ XÓA

Các field sau đã được loại bỏ khỏi thiết kế.

45.1 id
Trước
id: {
  bsonType: "string"
}
Lý do xóa

MongoDB đã tự có:

_id

Không cần tạo thêm ID thứ hai.

Sau
_id

do MongoDB quản lý.

46. slug
Trước
slug: {
  bsonType: "string"
}
Lý do xóa

Nếu slug luôn chỉ dùng như một ID dạng text:

snail-race
block-master

thì nó trùng vai trò định danh với _id.

Không cần lưu:

_id
slug

cùng lúc nếu không có nhu cầu SEO/URL slug riêng.

Sau

Chỉ dùng:

_id

Nếu sau này cần URL SEO riêng thì có thể thêm lại slug.

47. categoryLabel
Trước
categoryLabel: {
  bsonType: "string"
}

Ví dụ:

{
  "category": "quiz",
  "categoryLabel": "Trắc nghiệm"
}
Lý do xóa

categoryLabel chỉ là label hiển thị của:

category

Không cần lưu trùng trong Database.

Frontend có thể map:

const categoryLabels = {
  quiz: "Trắc nghiệm",
  puzzle: "Giải đố",
  racing: "Đua xe",
  board: "Board Game"
};
Sau

Chỉ lưu:

category
48. title
Trước

Game sử dụng:

title

Template sử dụng:

name
Lý do xóa

Hai field đều mang ý nghĩa:

Tên hiển thị

Không cần dùng hai tên khác nhau.

Sau

Thống nhất:

name

cho cả Game và Template.

49. template
Trước

Game có:

template
Lý do xóa

Tên template không rõ nó là:

Template object
Template name
Template ID
Sau

Dùng:

templateId

để thể hiện rõ Game đang tham chiếu Template.

50. htmlTemplate trong Game
Trước

Game có:

htmlTemplate: {
  bsonType: "string"
}
Lý do xóa

HTML đã thuộc trách nhiệm của Template.

Nếu Game và Template cùng lưu HTML:

Template
 └── htmlTemplate

Game
 └── htmlTemplate

sẽ bị duplicate.

Sau

Chỉ:

Template.htmlTemplate

Game chỉ:

Game.templateId
51. theme
Trước

Game có:

theme: {
  bsonType: "string"
}
Lý do xóa

Template đã chứa toàn bộ:

HTML
CSS
JavaScript

Do đó giao diện/theme của Game nên được Template quản lý.

Nếu theme chỉ dùng để xác định giao diện thì nó bị trùng trách nhiệm với Template.

Sau

Không lưu theme trong Game.

Nếu sau này theme thực sự là cấu hình gameplay riêng của từng Game thì có thể thêm lại.

52. cssTemplate

Không sử dụng.

Nếu trước đây dự định có:

cssTemplate

thì xóa.

CSS nằm trong:

htmlTemplate
53. jsTemplate

Không sử dụng.

Nếu trước đây dự định có:

jsTemplate

thì xóa.

JavaScript nằm trong:

htmlTemplate
54. Không xóa category

Không xóa:

category

Vì:

type

và:

category

không cùng ý nghĩa.

Ví dụ:

{
  "type": "play-to-win",
  "category": "racing"
}
55. Không xóa questionsCount

Không xóa:

questionsCount

vì đây là counter/cache.

Nó không thay thế collection questions.

56. Không xóa playersCount

Không xóa:

playersCount

nếu đang dùng để hiển thị thống kê số người chơi.

57. Không xóa code

Giữ:

code

nếu người chơi sử dụng mã để tham gia Game.

Ví dụ:

TOAN3
GAME123

Nếu hệ thống không sử dụng chức năng này thì có thể xóa.

58. So sánh trước và sau
Templates - TRƯỚC
_id
id
slug
name
description
category
categoryLabel
icon
ring
Templates - SAU
_id
name
description
type
category
icon
ring
htmlTemplate
thumbnail
version
status
createdAt
updatedAt

Đã xóa:

id
slug
categoryLabel

Đã thêm:

type
htmlTemplate
thumbnail
version
status
createdAt
updatedAt
59. Games - TRƯỚC
_id
id
slug
title
description
subject
topic
language
template
theme
htmlTemplate
status
questionsCount
playersCount
code
Games - SAU
_id
name
description
subject
topic
language
templateId
type
status
questionsCount
playersCount
code
createdAt
updatedAt

Đã xóa:

id
slug
template
theme
htmlTemplate

Đã đổi:

title
 ↓
name
template
 ↓
templateId

Đã thêm:

type
createdAt
updatedAt
60. Cấu trúc cuối cùng
MongoDB
│
├── templates
│   │
│   ├── _id
│   ├── name
│   ├── description
│   ├── type
│   ├── category
│   ├── icon
│   ├── ring
│   ├── htmlTemplate
│   ├── thumbnail
│   ├── version
│   ├── status
│   ├── createdAt
│   └── updatedAt
│
├── games
│   │
│   ├── _id
│   ├── name
│   ├── description
│   ├── subject
│   ├── topic
│   ├── language
│   ├── templateId
│   ├── type
│   ├── status
│   ├── questionsCount
│   ├── playersCount
│   ├── code
│   ├── createdAt
│   └── updatedAt
│
├── questions
├── players
├── results
├── users
├── categories
└── subjects
61. Final Relationship
                 templates
                     │
                     │ _id
                     │
                     ↓
              games.templateId
                     │
                     │
                     ↓
                   Game
                     │
                     │ _id
                     ↓
              questions.gameId

Template:

templates._id

Game:

games.templateId

Question:

questions.gameId

Tất cả đều sử dụng MongoDB ObjectId.

62. Final Rule
Template
Template = giao diện + gameplay logic

htmlTemplate
    ├── HTML
    ├── CSS
    └── JavaScript
Game
Game = dữ liệu/metadata của một game cụ thể

Game
    └── templateId
MongoDB
Không tạo id riêng.

Dùng:
_id
Không duplicate
Không lưu HTML trong Game.

Không lưu categoryLabel.

Không lưu slug nếu không cần URL riêng.

Không lưu title và name cùng lúc.

Không lưu template và templateId cùng lúc.

Không lưu theme nếu Template đã quản lý giao diện.
63. Kiến trúc cuối cùng
                    ADMIN
                      │
                      ↓
              Template Dashboard
                      │
                      ↓
                Template API
                      │
                      ↓
                templates
                      │
                      ├── _id
                      ├── name
                      ├── type
                      ├── category
                      ├── icon
                      ├── ring
                      └── htmlTemplate
                              │
                              │ templateId
                              ↓
                           games
                              │
                              ├── _id
                              ├── name
                              ├── type
                              ├── templateId
                              ├── subject
                              ├── topic
                              ├── language
                              ├── status
                              ├── questionsCount
                              ├── playersCount
                              └── code
                                      │
                                      ↓
                                  FRONTEND
                                      │
                                      ↓
                            Dynamic Game Renderer
                                      │
                              ┌───────┴───────┐
                              ↓               ↓
                       play-to-learn     play-to-win
                              │               │
                              ↓               ↓
                      dữ liệu câu hỏi    htmlTemplate
                       từ hệ thống       HTML + CSS + JS
                         riêng                │
                              │               │
                              └───────┬───────┘
                                      ↓
                                  GAME RUN
KẾT LUẬN

Mục tiêu cuối cùng là:

Template
    ↓
lưu HTML + CSS + JS

Game
    ↓
chỉ lưu templateId

MongoDB
    ↓
dùng _id, không tạo id riêng

Template mới được Admin thêm vào Database thì Frontend chỉ cần lấy Template từ API và render, không cần tạo thêm React component hoặc sửa code React cho từng game.