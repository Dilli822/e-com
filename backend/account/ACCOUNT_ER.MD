+-------------------+          +-------------------+            +-------------------+
|     UserData      |    1     |  SellerProfile    |   1        |   BuyerProfile    |
+-------------------+----------+-------------------+------------+-------------------+
| - username        | <------> |       user        | <--------> |       user        |
| - email           |          |     seller_id     |   1        |     buyer_id      |
| - first_name      |          |       bio         |            |       bio         |
| - last_name       |          | company_image     |            |      image        |
| - date_joined     |          |   company_name    |            |     address       |
| - is_admin        |          |   phone_number    |            |  phone_number     |
| - is_active       |          |      address      |            |                   |
| - is_staff        |          |                   |            |                   |
| - is_superuser    |          |                   |            |                   |
| - is_buyer        |          |                   |            |                   |
| - is_seller       |          |                   |            |                   |
+-------------------+          +-------------------+            +-------------------+
                                    1                               1
                                     \                             /
                                      \                           /
                                       \                         /
                                        \                       /
                                       +------------------------------------+
                                       |UserDetails|
                                       +-----------------------------------------+
                                       | - user |
                                       | - is_buyer |
                                       | - is_seller ||
                                       | - password_reset_token |
                                       | - password_reset_token_generated_time |
                                       | - password_reset_token_expire |
                                       +---------------------------------------+
