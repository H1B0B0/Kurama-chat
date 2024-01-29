resource "aws_instance" "app_server" {
  ami           = var.ami
  instance_type = "t2.micro"
  tags = {
    Name = "project-JSF"
  }
  root_block_device {
    encrypted = true
  }
  metadata_options {
    http_tokens = "required"
  }

  key_name = aws_key_pair.terraform-demo.key_name
}

resource "null_resource" "hosts" {
  depends_on = [aws_instance.app_server]
  triggers = {
    time = "${timestamp()}"
  }
  count = length(aws_instance.app_server)
  provisioner "local-exec" {
    command = "echo ${element(aws_instance.app_server[*].public_ip, count.index)} >> ./hosts"
    when    = create
  }
  provisioner "local-exec" {
    command = "rm -f ./hosts"
    when    = destroy
  }
}
