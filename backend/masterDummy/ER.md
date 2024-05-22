User ----< Cart >---- Order
  |                      ^
  |                      |
  v                      |
CartItem --------< OrderItem
  |
  v
Product ----< Review
  |
  v
Category



User
- One-to-one with Cart
- One-to-many with Review

Cart
- One-to-one with User
- One-to-many with CartItem

CartItem
- Many-to-one with Cart
- Many-to-one with Product

Category
- One-to-many with Product

Product
- Many-to-one with Category
- One-to-many with Review
- Many-to-many with Order through OrderItem

Review
- Many-to-one with Product
- Many-to-one with User

Order
- Many-to-one with User
- Many-to-many with CartItem through OrderItem

OrderItem
- Many-to-many with Order and CartItem
