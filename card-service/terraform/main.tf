provider "aws" {
  region  = "us-east-1"
  profile = "card-service-dev"
}

resource "aws_sqs_queue" "card_queue" {
  name = "card-queue"
}

resource "aws_dynamodb_table" "cards_table" {
  name         = "cards"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "cardId"

  attribute {
    name = "cardId"
    type = "S"
  }
}

resource "aws_iam_role" "lambda_role" {
  name = "card-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_lambda_function" "card_worker" {
  function_name = "cardApprovalWorker"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  filename      = "${path.module}/../dist/cardApprovalWorker.zip"
  source_code_hash = filebase64sha256("${path.module}/../dist/cardApprovalWorker.zip")
}
