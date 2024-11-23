document.addEventListener("DOMContentLoaded", function () {
    let input = "", secInput = "", exp = "";
    let symNum = 0;
    let open = 0; 

    const buttons = document.getElementsByClassName("el");

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", handleClick);
    }

    function handleClick() {
        const value = this.getAttribute("data-value");

        if (value === "clear") 
            clearInput()
        else if (value === "=") 
            evaluate()
        else {
            if (symNum === 0) clearInput(); 
            symNum++;
            append(value);
        }
    }

    function clearInput() {
        input = ""
        secInput = ""
        document.getElementById("screen").value = "";
        symNum = 0;
        open = 0;
    }

    function append(value) {

        if (value === "sin" || value === "cos" || value === "tan") {
            input += `${value}(`; 
            secInput += `${value}(`; 
            open++; 
            
        } else if (value === "(") {
            input += value;
            secInput += value;
            open++;

        } else if (value === ")") {

           if (open > 0) {
            if (exp === "nada") {
                secInput = `Math.pow(${secInput}, ${exp})`;
                exp = ""; 
            } else {
                secInput += value; 
            }
            open--; 
        } else {
            alert("Missing opening bracket");
            return;
        }

        input += value;

        } else if(value === "x^2"){
            if(input === ""){
                alert("Exponent without base")
                clearInput()
            }
            secInput = `Math.pow(${secInput}, 2)`;
            input += "^2"

        } else if(value === "x^y"){
            if(input === ""){
                alert("Exponent without base")
                clearInput()
            }
            exp = "nada"
            input += "^("
            open++;

        } else if(exp === "nada"){
            exp = value
            input += value; 
            secInput += value;
        }
        else {
            input += value; 
            secInput += value;
        }

        document.getElementById("screen").value = input;
    }

    function evaluate() {
        if (open > 0) {
            alert("Missing closing brackets!");
            return;
        }

        const tweakedInput = secInput
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")

        const result = Function('"use strict"; return (' + tweakedInput + ')')();
        secInput = result.toString(); 
        document.getElementById("screen").value = secInput;
        symNum = 0; 
    
    }

    document.addEventListener("keydown", function (event) {
        const validKeys = "0123456789+-*/.()";
        const key = event.key;

        if (key === "=") 
            evaluate();
        else if (validKeys.includes(key)) 
            append(key);
        else if (key === "Delete") clearInput();
        else if (key === "Backspace") {
            input = input.slice(0, -1); 
            document.getElementById("screen").value = input;
        } else if (key === "Shift") {}
        else {
            alert(`Unsupported key: ${key}`);
        }
    });
});
