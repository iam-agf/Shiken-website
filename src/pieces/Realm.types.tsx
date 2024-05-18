export interface Question {
    statement : string;
    kind : string;
    options : string;
    answer : string;
  }
  
  export interface Exam {
    title : string;
    description : string;
    questions : string;
    applicantString : string;
    hashAES: string;
  }
  