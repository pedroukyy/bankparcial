resource "aws_sqs_queue" "create_request_card_dlq" {
  name = "create-request-card-dlq"
}

resource "aws_sqs_queue" "create_request_card" {
  name                      = "create-request-card-sqs"
  redrive_policy            = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.create_request_card_dlq.arn
    maxReceiveCount     = 5
  })
}
