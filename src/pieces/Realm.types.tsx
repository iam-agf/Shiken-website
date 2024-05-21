export interface Question {
  topic: string;
  statement: string;
  kind: string;
  options: string;
  answer: string;
  hashAES: string;
}

export interface Exam {
  title: string;
  description: string;
  questions: string;
  applicantString: string;
  hashAES: string;
}

export interface Crypto {
  salt: string,
  randomAES: string
}
