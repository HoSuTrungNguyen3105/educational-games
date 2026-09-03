# 🚀 Lazy Loading / Dynamic Import

## Mục tiêu

Giảm bundle chính hiện tại:

```text
index.js ≈ 1.66 MB
gzip ≈ 462 KB
```

Sử dụng **React.lazy + dynamic import** để chỉ tải code khi người dùng cần.

## Thực hiện

### 1. Lazy load Page

Thay:

```js
import Garden from './pages/Garden';
```

bằng:

```js
const Garden = lazy(() => import('./pages/Garden'));
```

Các page lớn cần lazy load:

* Garden
* Game Center
* Profile
* Dashboard
* Editor
* Các page có thư viện nặng

### 2. Lazy load Game

Không import game trực tiếp vào bundle chính.

```js
const QuizBattle = lazy(() => import('./games/QuizBattle'));
const MathRunner = lazy(() => import('./games/MathRunner'));
const PuzzleGame = lazy(() => import('./games/PuzzleGame'));
```

Game chỉ được tải khi người dùng mở game.

### 3. Sử dụng Suspense

```jsx
<Suspense fallback={<PageLoading />}>
  <Garden />
</Suspense>
```

### 4. Lazy load thư viện nặng

Các thư viện chỉ dùng ở một page/game thì không import global. Sử dụng dynamic import để đưa chúng vào chunk riêng.

## PWA

Tiếp tục không precache toàn bộ game:

```js
globIgnores: [
  '**/games/**',
  '**/game/**',
  '**/*.mp3',
  '**/*.wav',
  '**/*.ogg',
  '**/*.mp4',
  '**/*.md',
]
```

## Yêu cầu

* Không thay đổi logic hiện tại.
* Không phá routing.
* Không thay đổi API/database.
* Không lazy load component nhỏ không cần thiết.
* Game/Garden chỉ tải khi người dùng mở.
* Sau `npm run build`, bundle chính phải giảm đáng kể so với ~1.66 MB.

Mục tiêu:

```text
App mở
 ↓
Tải Core App nhỏ
 ↓
Mở Garden → tải Garden chunk
Mở Game → tải Game chunk
Mở Editor → tải Editor chunk
```
