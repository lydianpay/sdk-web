export type Session = {
  uuid: number;
  userId: number;
};

export type SessionResponse = {
  status: 'CONFIRMED' | 'REJECTED' | 'PENDING';
};
