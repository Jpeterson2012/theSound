import './snackBar.css'


function snackBar(message: any){    
    return(
        <>
        <div id='snackbar5'>{message}</div>
        {callSnackBar()}       
        </>
    )
}
function callSnackBar(){
    var x = document.getElementById("snackbar5")!;
    console.log(x)
    x!.className = "show";
    setTimeout(function(){ x!.className = x!.className.replace("show", ""); }, 5000);
    return(
        <></>
    )
}
export { snackBar }