resource "aws_lambda_function" "register_user" {
  function_name = "register-user-lambda"
  runtime       = "nodejs18.x"
  handler = "registerUser.handler"

  role          = aws_iam_role.lambda_exec.arn

  filename         = "${path.module}/../user-service/dist/registerUser.zip"
  source_code_hash = filebase64sha256("${path.module}/../user-service/dist/registerUser.zip")

  environment {
    variables = {
      DYNAMO_TABLE = "user-table"
    }
  }

  tags = {
    Service = "user-service"
  }
}

resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
      Effect = "Allow",
      Sid    = ""
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
