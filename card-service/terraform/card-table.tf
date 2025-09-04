resource "aws_dynamodb_table" "card_table" {
  name         = "card-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "cardId"

  attribute {
    name = "cardId"
    type = "S"
  }

  tags = {
    Service = "card-service"
  }
}
