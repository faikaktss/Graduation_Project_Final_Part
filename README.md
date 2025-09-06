# 🛒 E-Ticaret Backend Projesi

Bu proje, **TypeScript, NestJS, Express.js, PostgreSQL ve Prisma ORM** kullanılarak geliştirilmiş modüler ve genişletilebilir bir **E-Ticaret Backend API**’dir.

Projenin amacı, adım adım geliştirilip büyütülebilecek bir altyapı sunarak **kimlik doğrulama, rol bazlı yetkilendirme (RBAC), kullanıcı yönetimi, ürün-kategori sistemi, sepet ve sipariş yönetimi, stok takibi** gibi temel e-ticaret özelliklerini sağlamaktır.

---

## 📌 Özellikler

*   JWT tabanlı kimlik doğrulama (refresh token rotation desteğiyle)
*   **Rol ve İzin bazlı yetkilendirme (RBAC)**
*   Kullanıcı rolleri (ADMIN, MODERATOR, USER)
*   Kategori ve ürün yönetimi
*   Ürün fotoğraf sistemi (sıra ve birincil fotoğraf desteğiyle)
*   Ürün yorum sistemi
*   Sepet yönetimi (CRUD işlemleri)
*   Sipariş yönetimi (sipariş kalemleri, durum yönetimi)
*   Stok yönetimi
*   Gelişmiş ürün filtreleme ve sıralama desteği

---

## 🚀 Teknoloji Yığını

| Katman      | Teknoloji                       |
| ----------- | ------------------------------- |
| Dil         | **TypeScript**                  |
| Framework   | **NestJS (Express.js tabanlı)** |
| Veri Tabanı | **PostgreSQL**                  |
| ORM         | **Prisma ORM**                  |
| Auth        | **Passport.js + JWT**           |

---

## ⚙️ Kurulum

1.  **Depoyu klonlayın:**

    ```bash
    git clone https://github.com/faikaktss/Graduation_Project_Final_Part.git
    cd Graduation_Project_Final_Part
    ```

2.  **Bağımlılıkları yükleyin:**

    ```bash
    npm install
    ```

3.  **Çevresel değişkenleri ayarlayın:**
    Ana dizine `.env` dosyası oluşturun:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce_db?schema=public"
    JWT_SECRET="super-secret-key"
    JWT_REFRESH_SECRET="super-refresh-secret"
    ```

4.  **Prisma ile veri tabanı tablolarını oluşturun:**

    ```bash
    npx prisma migrate dev --name init
    ```

5.  **(Opsiyonel) Başlangıç verilerini ekleyin (Roller, İzinler vb.):**
    ```bash
    npx prisma db seed
    ```

6.  **Sunucuyu çalıştırın:**

    ```bash
    npm run start:dev
    ```

API varsayılan olarak: `http://localhost:3000/api` adresinde çalışır.

---

## 🗂️ Veri Tabanı Yapısı

### Kullanıcılar (`users`)

*   `id`
*   `first_name`, `last_name`, `full_name`
*   `username`
*   `email`
*   `password` (hash)
*   `created_at`, `updated_at`

### Kategoriler (`categories`)

*   `id`, `name`, `slug`, `order`
*   `created_at`, `updated_at`

### Ürünler (`products`)

*   `id`, `category_id`
*   `name`, `slug`
*   `short_description`, `long_description`
*   `price`, `stock_quantity`
*   `primary_photo_url`
*   `comment_count`, `average_rating`
*   `created_at`, `updated_at`

### Ürün Fotoğrafları (`product_photos`)

*   `id`, `product_id`
*   `is_primary`
*   `url`, `size`, `order`
*   `created_at`, `updated_at`

### Ürün Yorumları (`product_comments`)

*   `id`, `user_id`, `product_id`
*   `title`, `content`
*   `rating (1-5)`
*   `created_at`, `updated_at`

### Sepet (`cart_items`)

*   `id`, `user_id`, `product_id`
*   `quantity`
*   `created_at`, `updated_at`

### Siparişler (`orders`)

*   `id`, `user_id`
*   `total_price`
*   `status` *(PENDING, PAID, SHIPPED, DELIVERED, CANCELLED)*
*   `created_at`, `updated_at`

### Sipariş Kalemleri (`order_items`)

*   `id`, `order_id`, `product_id`
*   `quantity`, `unit_price`
*   `created_at`, `updated_at`

### Roller (`roles`)

*   `id`, `name`, `description`

### İzinler (`permissions`)

*   `id`, `permissionKey`, `description`

### Kullanıcı Rolleri (`user_roles`) - Bağlantı Tablosu

*   `user_id`, `role_id`

### Rol İzinleri (`role_permissions`) - Bağlantı Tablosu

*   `role_id`, `permission_id`

---

## 📑 API Endpointleri

### 🔐 Auth

*   `POST /api/auth/register` → Yeni kullanıcı kaydı
*   `POST /api/auth/login` → Kullanıcı girişi
*   `GET /api/auth/me` → Mevcut kullanıcı bilgisi
*   `POST /api/auth/logout` → Oturum kapatma

### 👤 Kullanıcılar

*   `GET /api/users` → Kullanıcı listeleme
*   `GET /api/users/:id` → Kullanıcı görüntüleme
*   `PATCH /api/users/:id` → Kullanıcı güncelleme

### 🛡️ Rol ve İzin Yönetimi (Admin)

*   `POST /api/user-roles` → Kullanıcıya rol atama
*   `DELETE /api/user-roles` → Kullanıcıdan rolü geri alma
*   `POST /api/role-permissions` → Role izin atama
*   `DELETE /api/role-permissions` → Rolden izni geri alma
*   `GET /api/roles` → Tüm rolleri listeleme
*   `GET /api/permissions` → Tüm izinleri listeleme

### 🏷️ Kategoriler

*   `POST /api/categories` → Kategori oluşturma
*   `GET /api/categories` → Kategori listeleme
*   `GET /api/categories/:id` → Kategori görüntüleme
*   `PATCH /api/categories/:id` → Kategori güncelleme
*   `DELETE /api/categories/:id` → Kategori silme

### 📦 Ürünler

*   `POST /api/products` → Ürün oluşturma
*   `GET /api/products` → Ürün listeleme *(filtreleme & sıralama destekli)*
*   `GET /api/products/:id` → Ürün görüntüleme
*   `PATCH /api/products/:id` → Ürün güncelleme
*   `DELETE /api/products/:id` → Ürün silme

### 🖼️ Ürün Fotoğrafları

*   `POST /api/product-photos` → Fotoğraf ekleme
*   `PATCH /api/product-photos/:id` → Fotoğraf güncelleme (sıra, birincil)
*   `DELETE /api/product-photos/:id` → Fotoğraf silme

### 💬 Yorumlar

*   `POST /api/comments` → Yorum ekleme
*   `GET /api/comments` → Yorum listeleme *(product\_id & rating filtreli)*
*   `GET /api/comments/:id` → Yorum görüntüleme
*   `PATCH /api/comments/:id` → Yorum güncelleme
*   `DELETE /api/comments/:id` → Yorum silme

### 🛒 Sepet

*   `POST /api/cart-items` → Sepete ürün ekleme
*   `GET /api/cart-items` → Sepeti listeleme
*   `PATCH /api/cart-items/:id` → Ürün miktarı güncelleme
*   `DELETE /api/cart-items/:id` → Sepetten ürün silme
*   `DELETE /api/cart-items` → Sepeti temizleme

### 📦 Siparişler

*   `POST /api/orders` → Sepeti siparişe dönüştürme
*   `GET /api/orders` → Sipariş listeleme
*   `GET /api/orders/:id` → Sipariş görüntüleme
*   `PATCH /api/orders/:id` → Sipariş güncelleme (status)

---

## 🔍 Filtreleme & Sıralama

Ürünler, query string parametreleriyle filtrelenebilir ve sıralanabilir.

### Filtreleme Parametreleri

*   `category_id`
*   `min_price`, `max_price`
*   `min_rating`

### Sıralama Parametreleri

*   `sort=price_asc` → En ucuzdan pahalıya
*   `sort=price_desc` → En pahalısından ucuza
*   `sort=rating_desc` → En yüksek puanlıdan düşük puanlıya
*   `sort=newest` → En yeni ürünlerden eskiye

**Örnek:**

```http
GET /api/products?category_id=2&min_price=100&max_price=500&sort=price_asc
```

---
