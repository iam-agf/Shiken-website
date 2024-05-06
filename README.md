# History

- First connection with Adena wallet 
- Now the website checks the address
- Can fetch information from the gno.land website for realm information via using gno-client-js.
- In `AddExam` now the content sent to the realm is encrypted via AES, then the key and vector are encrypted via RSA, and finally the RSA private key is encrypted with the SHA256 hash of the password of the creator.
- In `AddQuestion` the content isn't encrypted yet but now the whole form to send a question is working.
