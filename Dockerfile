ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8
# Install requirements for add-on
RUN apk add --no-cache nodejs

# Copy data for add-on
COPY run.sh /
COPY hello.js /

RUN chmod a+x /run.sh

CMD [ "/run.sh" ]