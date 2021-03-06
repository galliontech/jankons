# Migration `20201018082740-dev-bookmarks`

This migration has been generated by Jonathon Green at 10/18/2020, 7:27:41 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "Bookmark" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "url" TEXT NOT NULL,
    "tag" TEXT NOT NULL DEFAULT 'default',
    "name" TEXT
)

CREATE TABLE "BookmarkViews" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "bookmarkId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("bookmarkId") REFERENCES "Bookmark"("id") ON DELETE CASCADE ON UPDATE CASCADE
)

CREATE UNIQUE INDEX "Bookmark.url_unique" ON "Bookmark"("url")

CREATE UNIQUE INDEX "Bookmark.name_unique" ON "Bookmark"("name")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201010121717-initial-setup..20201018082740-dev-bookmarks
--- datamodel.dml
+++ datamodel.dml
@@ -1,21 +1,44 @@
-// This is your Prisma schema file,
-// learn more about it in the docs: https://pris.ly/d/prisma-schema
-
-datasource db {
-  provider = "sqlite"
-  url = "***"
-}
-
-generator client {
-  provider = "prisma-client-js"
-}
-
-// Models
-model User {
-  id        Int       @default(autoincrement()) @id
-  createdAt DateTime  @default(now())
-  updatedAt DateTime  @updatedAt
-  email     String    @unique
-  username  String    @unique
-  hash      String
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "sqlite"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+// Models
+model User {
+  id        Int       @default(autoincrement()) @id
+  createdAt DateTime  @default(now())
+  updatedAt DateTime  @updatedAt
+  email     String    @unique
+  username  String    @unique
+  hash      String
+}
+
+// TODO: test with https://redash.io/ ;)
+
+// Bookmarks
+
+model Bookmark {
+  id        Int       @default(autoincrement()) @id
+  createdAt DateTime  @default(now())
+  updatedAt DateTime  @updatedAt
+  isActive  Boolean   @default(true) // Use for soft delete in future
+  url       String    @unique
+  tag       String    @default("default")
+  name      String?   @unique
+}
+
+model BookmarkViews {
+  id          Int       @id @default(autoincrement())
+  user        User      @relation(fields: [userId], references: [id])
+  userId      Int
+  bookmark    Bookmark  @relation(fields: [bookmarkId], references: [id])
+  bookmarkId  Int
+  count       Int
 }
```


