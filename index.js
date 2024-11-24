document.addEventListener("DOMContentLoaded", function () {
    let input = "", secInput = "", exp = "", root = "", base = "",num="", fact = false, equation = "", solving = false;;
    let symNum = 0;
    let open = 0; 

    const buttons = document.getElementsByClassName("el");

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", handleClick);
    }

    function handleClick() {
        const value = this.getAttribute("data-value");

        if (value === "clear") 
            clearInput();
        else if (value === "=") 
            evaluate();
        else {
            if (symNum === 0 && !solving) clearInput();
            symNum++;
            append(value);
        }
    }

    function clearInput() {
        input = "";
        secInput = "";
        equation = "";
        solving = false;
        document.getElementById("screen").value = "";
        symNum = 0;
        open = 0;
    }

    function append(value) {

        const signs = "+-*/";

        // if(input!="" && input.charAt(input.length-1)==")" && !signs.includes(value))
        //     secInput += "*"
        
        if (solving) {
            equation += value;
            document.getElementById("screen").value = equation;
            return;
        }

        if (value === "exp") {
            input += "exp(";
            secInput += "Math.exp(";
            open++

        }else if (value === "sin" || value === "cos" || value === "tan") {

            if(!signs.includes(input.charAt(input.length-1)))
                secInput += "*"

            input += `${value}(`;
            secInput += `${value}(`;
            open++;
        } else if (value === "(") {

            if(secInput!="" && !signs.includes(secInput.charAt(secInput.length-1)))
                secInput += "*" + value;
            else
                secInput += value;

            input += value;
            open++;

        } else if (value === ")") {
            if (open > 0) {
                if (exp && exp !== "nada") {
                    secInput = `Math.pow(${secInput.replace(exp, "")}, ${exp})`;
                    exp = "";
                } else if (root && root !== "nada") {
                    secInput = `Math.pow(${secInput.replace(root, "")}, 1/${root})`;
                    root = "";
                } else if (num && num !== "nada") {
                    secInput = extractBeforeLog(secInput) + `Math.log(${num})/Math.log(${base})`;
                    num = "";
                    base = "";
                } else if (base && base !== "nada") {
                    num = "nada";
                } else {
                    secInput += value;
                }
                open--;
            } else {
                alert("Missing opening bracket");
                return;
            }
    
            if (base && base !== "nada") {
                input += ")(";
                open++;
            } else {
                input += value;
            }
        } else if (value === "x^2") {
            if (input === "") {
                alert("Exponent without base");
                clearInput();
            }
            secInput = `Math.pow(${secInput}, 2)`;
            input += "^2";
        } else if (value === "x^y") {
            if (input === "") {
                alert("Exponent without base");
                clearInput();
            }
            exp = "nada";
            input += "^(";
            open++;
        } else if (value === "π") {
            const constantValue = "Math.PI";
            if (base === "nada") base = constantValue;
            else if (exp === "nada") exp = constantValue;
            else if (num === "nada") num = constantValue;
            else secInput += (input !== "" ? "*" : "") + constantValue;
            input += value;

        } else if (value === "e") {
            const constantValue = "Math.E";
            if (base === "nada") base = constantValue;
            else if (exp === "nada") exp = constantValue;
            else if (num === "nada") num = constantValue;
            else secInput += (input !== "" ? "*" : "") + constantValue;
            input += value;

        } else if(value ==="ln"){
            input += "ln(";
            base = "Math.E";
            num = "nada";
            open++;
        }else if (value === "√") {
            input += value + "(";
            secInput += "Math.sqrt(";
            open++;
        } else if (value === "x√") {
            if(secInput.includes("("))
                root = extractContent(secInput)
            else
                root = secInput;
            input += "√(";
            open++;
        } else if (value === "log") {

            secInput += (input !== ""&& !signs.includes(secInput.charAt(secInput.length-1)) ? "*" : "")
            input += "log_(";
            base = "nada";
            open++;

        }else if(value === "x!"){
            input += "!";
            if(secInput.includes("(") && secInput.charAt(secInput.length-1)==")")
                secInput = secInput.replace(`(${extractContent(secInput)})`,"") + factorial(extractContent(secInput)).toString()
            else
                secInput = factorial(secInput).toString()
            
        } else if (exp) {
            if (exp === "nada") 
                exp = "";
            exp += value;
            input += value;
            secInput += value;

        } else if (num) {
            if (num === "nada") 
                num = "";
            num += value;
            input += value;

        } else if (base) {
            if (base === "nada") 
                base = "";
            base += value;
            input += value;
        } else {
            input += value;
            secInput += value;
        }
    
        document.getElementById("screen").value = input;
    }    


    function factorial(n) {
        if(n == 0 || n === 1)
            return 1

        if (n < 0) {
            throw new Error("Factorial is not defined for negative numbers");
        }

        return n * factorial(n - 1);
    }

    function extractContent(input) {
        let stack = [];
        let temp = "";
    
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
    
            if (char === '(') {
                // Start of a new bracketed section
                stack.push(char);
            } else if (char === ')') {
                // End of a bracketed section
                stack.pop();
                if (stack.length === 0) {
                    // If the stack is empty, we've found the outermost brackets
                    return temp;  // Return the content inside the outermost brackets
                }
            } else {
                if (stack.length > 0) {
                    // Collect characters inside brackets
                    temp += char;
                }
            }
        }
    }

    function extractBeforeLog(input) {
        const logIndex = input.indexOf('log');  
        if (logIndex !== -1) {  
            return input.slice(0, logIndex); 
        }
        
        return input; 
    }

    function evaluate() {

        console.log(secInput);

        if (open > 0) {
            alert("Missing closing brackets!");
            return;
        }

        const tweakedInput = secInput
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/√/g, "Math.sqrt")
        
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
