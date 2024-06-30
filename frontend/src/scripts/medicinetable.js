import axios from 'axios';
function fetchandrendertable(){
axios.get("./medication")
.then(response => {

})
	.catch(error => {
	console.log("error rendering medication table");
	});
}
