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
): string => {
  // Extract the seconds and nanos
  const seconds = grpcTimestamp.seconds; // Assuming high is 0 and unsigned is false
  const nanos = grpcTimestamp.nanos;

  // Convert to milliseconds
  const milliseconds = seconds * 1000 + Math.floor(nanos / 1000000);

  // Create a JavaScript Date object
  const date = new Date(milliseconds);

  // Convert to ISO 8601 format for Prisma
  const prismaTimestamp = date.toISOString();

  return prismaTimestamp;
};
