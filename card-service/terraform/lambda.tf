resource "aws_lambda_function" "card_approval_worker" {
  function_name = "card-approval-lambda"
  runtime       = "nodejs18.x"
  handler       = "handlers/cardApprovalWorker.handler"
  role          = aws_iam_role.lambda_exec.arn

  filename         = "${path.module}/../dist/cardApprovalWorker.zip"
  source_code_hash = filebase64sha256("${path.module}/../dist/cardApprovalWorker.zip")

  environment {
    variables = {
      CARD_TABLE = "card-table"
    }
  }

  tags = {
    Service = "card-service"
  }
}

resource "aws_lambda_event_source_mapping" "sqs_trigger" {
  event_source_arn = aws_sqs_queue.create_request_card.arn
  function_name    = aws_lambda_function.card_approval_worker.arn
  batch_size       = 1
  enabled          = true
}
