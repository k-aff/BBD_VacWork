document.addEventListener("DOMContentLoaded", function () {
    let input = "", secInput = "", exp = "", root = "", rootNum="", base = "",num="", number = "", answer="", perc = "", percNum="", Exp=false, solving = false;
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
            if (symNum === 0) clearInput();
            symNum++;
            append(value);
        }
    }

    function clearInput() {
        input = "";
        secInput = "";
        equation = "";
        num = ""
        root = ""
        base = ""
        exp = ""
        number = ""
        perc = ""
        percNum = ""
        rootNum = ""
        Exp = false;
        solving = false;
        document.getElementById("screen").value = "";
        symNum = 0;
        open = 0;
    }

    function append(value) {

        const signs = "+-*/(";

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
            Exp = true;

        }else if (value === "sin" || value === "cos" || value === "tan") {

            if(!signs.includes(secInput.charAt(secInput.length-1)))
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
                    secInput += `Math.pow(${number}, ${exp})`;
                    exp = "";
                } else if (rootNum && rootNum !== "nada") {
                    secInput += `Math.pow(${rootNum}, 1/${root})`;
                    root = ""
                    rootNum = ""
                } else if (num && num !== "nada") {
                    secInput = extractBeforeLog(secInput) + `Math.log(${num})/Math.log(${base})`;
                    num = "";
                    base = "";
                } else if (base && base !== "nada") {
                    num = "nada";
                }else if(percNum && percNum!="nada"){
                    secInput = "(" + secInput + perc/100 * percNum + ")";
                    perc = ""
                    percNum = ""
                }else if(Exp)
                {
                    secInput += ")"
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
            if(secInput.includes("(") && secInput.charAt(secInput.length-1)==")")
                secInput = secInput.replace(`(${extractContent(secInput)})`,"") + `Math.pow(${extractContent(secInput)}, 2)`;
            else
                secInput = `Math.pow(${secInput}, 2)`

                console.log(secInput);

            input += "^2";

        } else if (value === "x^y") {
            if (input === "") {
                alert("Exponent without base");
                clearInput();
            }
            exp = "nada";

            if(secInput.includes("(") && secInput.charAt(secInput.length-1)==")"){
                number = extractContent(secInput);
                secInput = secInput.replace(`(${number})`,"");
            }
            else {  
                number = secInput;
                secInput = "";
            }
            console.log(secInput)
            input += "^(";
            open++;

        } else if (value === "π") {
            const constantValue = "Math.PI";
            if (base === "nada") base = constantValue;
            else if (exp === "nada") exp = constantValue;
            else if (num === "nada") num = constantValue;
            else secInput += (input !== ""&& !signs.includes(secInput.charAt(secInput.length-1)) ? "*" : "") + constantValue;
            input += value;

        } else if (value === "e") {
            const constantValue = "Math.E";
            if (base === "nada") base = constantValue;
            else if (exp === "nada") exp = constantValue;
            else if (num === "nada") num = constantValue;
            else secInput += (input !== ""&& !signs.includes(secInput.charAt(secInput.length-1)) ? "*" : "") + constantValue;
            input += value;

        } else if(value ==="ln"){
            secInput += (input !== ""&& !signs.includes(secInput.charAt(secInput.length-1)) ? "*" : "")
            input += "ln(";
            base = "Math.E";
            num = "nada";
            open++;

        }else if (value === "√") {
            secInput += (input !== ""&& !signs.includes(secInput.charAt(secInput.length-1)) ? "*" : "")
            input += value + "(";
            secInput += "Math.sqrt(";
            open++;

        } else if (value === "x√") {

            if(secInput.includes("(") && secInput.charAt(secInput.length-1)==")"){
                root = extractContent(secInput)
                secInput = secInput.replace(`(${root})`,"")
            }else{
                root = secInput;
                secInput = ""
            }
            
            rootNum = "nada"
            input += "√(";
            open++;

            console.log(root)
            console.log(secInput)


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
            
        } else if(value === "%"){
            input += "%(";
            open++
            if(secInput.includes("(") && secInput.charAt(secInput.length-1)==")"){
                perc = extractContent(secInput)
                secInput = secInput.replace(`(${perc})`,"") 
                percNum = "nada"
            }else{
                perc = secInput;
                secInput = ""
                percNum = "nada"
            }

        }else if(value==="ans"){
            input +="ans";
            secInput += answer
            
        }else if (exp) {
            if (exp === "nada") 
                exp = "";
            exp += value;
            input += value;
            // secInput += value;

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

        }else if(percNum){
            if(percNum==="nada")
                percNum= ""
            percNum += value
            input += value
            
        } else if(rootNum){
            if(rootNum==="nada")
                rootNum= ""
            rootNum += value
            input += value
        }else {
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

    function extractContent(Finput) {
        let stack = [];
        let temp = "";
        let foundClosing = false;

        for (let i = Finput.length - 1; i >= 0; i--) {
            const char = Finput[i];

            if (char === ')') {
                if (!foundClosing) {
                    foundClosing = true;
                }
                stack.push(char);
            } else if (char === '(') {
                stack.pop();
                if (stack.length === 0 && foundClosing) {
                    return temp.split('').reverse().join('');
                }
            } else if (foundClosing && stack.length > 0) {
                temp += char;
            }
        }

        return "";
    }

    function extractBeforeLog(Finput) {
        const logIndex = Finput.indexOf('log');  
        if (logIndex !== -1) {  
            return Finput.slice(0, logIndex); 
        }
        
        return Finput; 
    }

    function extractLastOperation(Finput) {

        const operationRegex = /[+\-*/^](?=[^\d]*$)/;
        
        const lastOperationIndex = Finput.search(operationRegex);  
    
        if (lastOperationIndex !== -1) {
            return Finput.slice(lastOperationIndex + 1).trim();  
        }
    
        return Finput.trim(); 
    }
    

    function evaluate() {

        console.log(secInput)

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
        answer = secInput;
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
