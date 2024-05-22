# Views

## AddQuestion

Call the realm to add a question (`AddQuestion`). Input:
- Your encryption key (this is unique and you should save it in order to decrypt the question)
- Topic (The topic your question will be about)
- Question statement (what you're asking)
- Options (the possible answers of your question)
- Answer (the answer of your question, which should be contained in your options)

If:
- Your question (decrypted) isn't longer than 5 chars or
- Among your options are repeated entries or
- An option is empty or
- Your answer isn't in your options
your question won't be sent

## Add Exam

Call the realm to add a exam (`AddExam`). Input:
- Your encryption key (this is unique and you should save it in order to decrypt the exam content)
- Title (A title for your exam)
- Description (A space to add information about/for your exam, like instructions or an explanation)
- Questions (You'll get the list of questions and they'll be stored in an avl.Tree in the realm)
- Applicants (An array of the applicants for your exam)

If:
- Your exam (decrypted) isn't longer than 5 chars or
- Your description (decrypted) isn't longer than 5 chars
your exam won't be sent 

You can always add the applicants later (consideringthe applicants can arrive even up to the last time) 
and questions too as long as the starting time hasn't been reached. 
The applicants string isn't encrypted to allow the realm show the applicants for that exam.

#### TODO

* Add the `startTime` and `endTime` entries for the exam to send them to the realm.
* Add the list of available questions to add them to the exam.
* Combine both views into only one to avoid having two views for adding pieces, in the same way as Read Data

## Edit Exam

Request an exam by its Id and you'll receive its encrypted information. If you add the decrypt key, 
you can read the content, but also you can send an edit for it. This is only possible for the realm creator.

The applicants string isn't encrypted to allow the realm show the applicants for that exam.

#### TODO

Add the `startTime` and `endTime` entries for the exam to update them to the realm.
Add the list of available questions to add them to the exam.

## Why not Edit Exam view?

The Question is the smallest component of this realm. Updating a question implies unnecessary complications
like checking if the question was already used in a past exam or cheking if it's used for another to happen.
Also, they're so few entries in a Question, that it's even simpler to create a new one and delete the one that
is wrong.

## Read Data

Allows you to read (in its encrypted form) an exam or a question based on their id. 
It won't return any input if the id doesn't exist.
There's an entry to allow you decrypt easily the question/exam.
You can't edit any information from the structures you read.

## My Data

This view allows the user to check the connected address to the website and see which exams the address is added to.
The owner of this view has the possibility to drop from an exam. This action is irreversible and should be treated with caution.

#### TODO

The applicant should be allowed to check the exams that has applied and the amount.


## Apply Exam

This view is under construction. Should show the available exams in the current time you're checking it and let you enter to
decrypt the exam and start working on it. The view should also allow you to send your answers and store them for the creator 
to score your results.

#### TODO

Consult if the creator should post the score of the user and let the user know his/her score OR let the creator reach this address
and just tell the final result.