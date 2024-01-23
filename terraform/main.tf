resource "aws_instance" "app_server" {
  ami           = "ami-0c03e02984f6a0b41"
  instance_type = "t2.micro"

  tags = {
    Name = "project-JSF"
  }

}

resource "null_resource" "hosts" {
  depends_on = [aws_instance.web]
  triggers = {
    time = "${timestamp()}"
  }
  count = length(aws_instance.web)
  provisioner "local-exec" {
    command = "echo ${element(aws_instance.web[*].public_ip, count.index)} >> ./hosts"
    when    = create
  }
  provisioner "local-exec" {
    command = "rm -f ./hosts"
    when    = destroy
  }
}
