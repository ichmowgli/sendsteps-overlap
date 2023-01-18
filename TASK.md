For our customers it’s important that our software is able to detect certain patterns in words or sentences.
Right now, they have asked us to detect overlapping words within words. For example, take the word “device” and the word “ice”. Of course, the latter occurs in the word “device”. In this case our clients will be happy to learn the overlapping characters and the number of characters that overlap. In this case “ice” and “3”.
Our clients also want to detect if an occurrence of the characters is hidden in another word, as long as the characters are in the same order. If we take “ice” again, you will see that it is hidden in the word “intercities” on position 1, 6 and 10. And will therefor return precisely the same response as the comparison with “device”.
However, in the match with the word “client”, although it contains the characters of the word “ice”, it will generate a different response for our client. Because the order in which the characters occur is different than in the word “ice” it has only partial overlap namely the characters “I” and “E”. The response will be different, in this case “ie” and “2”. Another example of such a partial match is between the words “orange” and “rhinoceros”. In this case the longest overlap we can detect between the two words is “rne”, which is 3 characters.
Our algorithm needs to be able to support the functionality above for any type of character input to be matched.

💄 Frontend
A demo website built in ReactJS. It should contain two input fields and a submit button, after which it calls the backend to perform the detection and display the result. There should be some sparkly animation visible for the user to bring them great joy.

✨ Backend
The backend should have an endpoint which takes a json object as input and return a json object with the response.

⚡Submission Specifications
Source code
Build/run instructions. We have node 16 and docker available on the test machine.
Approach the assignment as a real business project.
