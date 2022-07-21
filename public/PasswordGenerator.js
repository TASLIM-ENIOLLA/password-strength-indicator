class PasswordGenerator{
    generatePassword(obj){
        let result = "";
        let length = obj.length || 16;
        // let uppercase = ((obj.uppercase === undefined) ? true : obj.uppercase);
        // let lowercase = ((obj.lowercase === undefined) ? true : obj.uppercase);
        // let symbol = ((obj.lowercase === undefined) ? true : obj.uppercase);
        for(let x = 1; x <= length; x++){
            let arr = [
                this.getRandomUpper(),
                this.getRandomUpper(),
                this.getRandomUpper(),
                this.getRandomUpper(),
                this.getRandomLower(),
                this.getRandomLower(),
                this.getRandomLower(),
                this.getRandomLower(),
                this.getRandomLower(),
                this.getRandomLower(),
                this.getRandomLower(),
                this.getRandomLower(),
                this.getRandomNumber(),
                this.getRandomNumber(),
                this.getRandomSymbol(),
                this.getRandomSymbol()
            ];

            let index = Math.floor(Math.random() * arr.length);

            result += arr[index];

        }

        return result;

    }
    getRandomLower = () => {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
    }
    getRandomUpper = () => {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
    }
    getRandomNumber = () => {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 48)
    }
    getRandomSymbol = () => {
        const symbols = '!@#$%^&*(){}[]=<>/,.';
        return symbols[Math.floor(Math.random() * symbols.length)];
    }
}

var passwordGenerator = new PasswordGenerator();
