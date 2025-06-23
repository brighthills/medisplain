### To generate the required lambda cryptography layer:

```
FROM public.ecr.aws/lambda/python:3.11

# Install build tools
RUN yum install -y gcc python3-devel zip git

# Prevent building with Rust
ENV CRYPTOGRAPHY_DONT_BUILD_RUST=1

# Create layer content
WORKDIR /layer
RUN pip3 install --upgrade pip && \
    pip3 install "cryptography==39.0.2" "cffi==1.15.1" -t python && \
    zip -r9 cryptography-layer.zip python


docker build -t cryptography-layer .
docker create --name tmp cryptography-layer
docker cp tmp:/layer/cryptography-layer.zip ./cryptography-layer.zip
docker rm tmp

```