import { Timestamp as TimeStampGrpc } from 'google-protobuf/google/protobuf/timestamp_pb';
import { Timestamp } from 'google/protobuf/timestamp';
export const dateToTimestamp = (
  date: Date,
): { seconds: number; nanos: number } => {
  const timestamp = new TimeStampGrpc();
  timestamp.setSeconds(Math.floor(date.getTime() / 1000));
  timestamp.setNanos((date.getTime() % 1000) * 1e6);
  return {
    seconds: timestamp.getSeconds(),
    nanos: timestamp.getNanos(),
  };
};
export const convertGrpcTimestampToPrisma = (
  grpcTimestamp: Timestamp,
): Date => {
  const seconds = grpcTimestamp.seconds;
  const nanos = grpcTimestamp.nanos;
  const milliseconds = seconds * 1000 + Math.floor(nanos / 1000000);
  return new Date(milliseconds);
};
