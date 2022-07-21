import React, {Component} from "react";
import "./App.css";

class App extends Component{
    constructor(){
        super();

        this.state = {
            legendTabOpen: false,
            seeMore: false,
            mobileMenuOpen: false,
            autoTest: !false,
            rezHeight: 400,
            clipboardSaved: false,
            inputType: "password",
            testButtonText: "test password",
            password: "",
            passwordTest: {
                score: 0,
                character_length: 0,
                uppercase_chars: 0,
                lowercase_chars: 0,
                special_chars: 0,
                guesses: 0,
                suggestions: [],
                warning: "",
                pattern: []
            }
        }
    }

    openLegendTab = (e) => {
        if(this.state.legendTabOpen){
            this.setState({
                legendTabOpen: false
            });
        }
        else{
            this.setState({
                legendTabOpen: true
            });
        }
    }

    testPassword = () => {
        let password = document.querySelector("#password").value;
        let result = window.zxcvbn(password);
        let uppercase_chars = ((password.toString().match(/[A-Z]/g) != null) ? password.toString().match(/[A-Z]/g).length : 0);
        let lowercase_chars = ((password.toString().match(/[a-z]/g) != null) ? password.toString().match(/[a-z]/g).length : 0);

        new Promise(
            (res) => {
                this.setState({
                    testButtonText: "testing"
                });
                res(document.querySelector("#password_analysis_display").scrollIntoView());
            }
        ).then(
            () => {
                setTimeout(
                    () => {
                        this.setState({
                            testButtonText: "test password",
                            passwordTest: {
                                score: result.score,
                                guesses: result.guesses,
                                suggestions: result.feedback.suggestions,
                                warning: result.feedback.warning,
                                pattern: result.sequence,
                                character_length: password.length,
                                uppercase_chars: uppercase_chars,
                                lowercase_chars: lowercase_chars,
                                special_chars: password.length - uppercase_chars - lowercase_chars
                            }
                        });
                    }, 300
                );
            }
        );
    }

    automaticTest = (e) => {
        this.setState({
            clipboardSaved: false,
            password: e.target.value
        });
        if(this.state.autoTest){
            this.testPassword();
        }
    }

    toggleAutoTest = (e) => {
        this.setState({
            autoTest: !this.state.autoTest
        });
    }

    legendTabFocusOut = () => {
        this.setState({
            legendTabOpen: false
        });
    }

    scrollToSection = (e) => {
        let element = e.target;
        let target = element.getAttribute("data-custom-target");
        let dest = document.querySelector("[data-targeted = '" + target + "']");

        this.setState({
            mobileMenuOpen: false
        })

        if(dest){
            let x = 0;
            let b = {
                a : true,
                b : 0
            }
            let timeout = setInterval(
                () => {
                    if(b.a && window.scrollY < dest.offsetTop){
                        x = x * (1 + 0.009) + 3;
                        window.scrollTo(0, x);

                        if(b.b === window.scrollY){
                            b.a = false;
                        }
                        else{
                            b.b = window.scrollY;
                        }
                    }
                    else{
                        clearInterval(timeout);
                    }
                }, 1
            );
        }
    }

    seeMore = (e) => {
        if(this.state.seeMore){
            this.setState({
                seeMore: false
            });
        }
        else{
            this.setState({
                seeMore: true
            });
        }
    }

    passwordTestAnalysis = () => {
        let NA = "N/A";
        let returnSuggestions = () => {
            let res = [];
            let pword = this.state.password;
            let password_suggestion = window.passwordGenerator.generatePassword({
                length: 25
            });

            res.push(
                <div key = "-" className = "mb-2">
                    <div className = "flex-h j-c-c a-i-c mb-2">
                        <span className = "flex-1 bold single-line text-secondary">Suggested password</span>
                    </div>
                    <div className = "flex-h j-c-c a-i-c border rounded">
                        <input type = "text" id = "password_suggestion" className = "p-2 h-100 flex-1 border-0 outline-0 ml-1 bg-clear" readOnly defaultValue = {password_suggestion} />
                        <span id = "copy_password_suggestion" className = "fa fa-clipboard p-3 cursor-pointer" onClick = {
                            (e) => {

                                e.target.classList.add("text-primary");
                                window.navigator.clipboard.writeText(document.querySelector("#password_suggestion").value);

                                alert("Password saved to clipboard.")
                            }
                        }></span>
                        <span className = "fa fa-repeat p-3 cursor-pointer" onClick = {
                            (e) => {
                                document.querySelector("#password_suggestion").value = window.passwordGenerator.generatePassword({
                                    length: 25
                                })

                                document.querySelector("#copy_password_suggestion").classList.remove("text-primary");
                            }
                        }></span>
                    </div>
                </div>
            );

            if(pword.length < 8){
                res.push(
                    <li key = "_1">Password must be at least 8 characters long</li>
                );
            }

            if(!/[A-Z]/.test(pword)){
                res.push(
                    <li key = "_2">Password must be at least 1 uppercase character.</li>
                );
            }

            if(!/[a-z]/.test(pword)){
                res.push(
                    <li key = "_3">Password must be at least 1 lowercase character.</li>
                );
            }

            if(!/[0-9]/.test(pword)){
                res.push(
                    <li key = "_4">Password must be at least 1 number.</li>
                );
            }

            if(!/[^a-zA-z0-9]/.test(pword)){
                res.push(
                    <li key = "_5">Password must be at least 1 special character.</li>
                );
            }

            return res.map(
                item => {
                    return item;
                }
            );
        }

        let returnPasswordStrength = () => {
            let score = this.state.passwordTest.score;

            if(score >= 0 && score <= 0.8){
                return "very weak";
            }
            else if(score > 0.8 && score <= 0.8 * 2){
                return "weak";
            }
            else if(score > 0.8 * 2 && score <= 0.8 * 3){
                return "normal";
            }
            else if(score > 0.8 * 3 && score <= 0.8 * 4){
                return "strong";
            }
            else if(score > 0.8 * 4 && score <= 0.8 * 5){
                return "very strong";
            }
        }

        let returnWarnings = () => {
            return this.state.passwordTest.warnings || NA;
        }

        let returnCrackSequence = () => {
            if(this.state.passwordTest.pattern.length > 0){
                let pattern = this.state.passwordTest.pattern;

                return pattern.map(
                    (item, key) => {
                        if(pattern.length > 1){
                            return <li key = {key}>{item.pattern} - ({item.token})</li>;
                        }
                        else{
                            return <span key = {key}>{item.pattern} - ({item.token})</span>;
                        }
                    }
                );
            }
            else{
                return NA;
            }
        }

        return {
            password: this.state.password || NA,
            suggestions: returnSuggestions(),
            password_strength: returnPasswordStrength(),
            warnings: returnWarnings(),
            guesses: this.state.passwordTest.guesses,
            crack_sequence: returnCrackSequence()
        }
    }


    render(){
        // let Events = ["load", "resize"];
        //
        // Events.forEach(
        //     item => {
        //         window.addEventListener(
        //             item,
        //             () => {
        //                 if(item === "load"){
        //                     let w = document.querySelector("#rez").getBoundingClientRect().width;
        //
        //                     this.testPassword();
        //
        //                     this.setState({
        //                         rezHeight: (w * 0.888889)
        //                     });
        //                 }
        //             }
        //         );
        //     }
        // );

        return (
            <section>
                <header className="text-white bg-light flex-v">
                    <div className="bg-dark">
                        <nav className="p-3 container po-rel flex-h j-c-space-between a-i-c">
                            <span>
                                <div className="bold text-white text-uppercase">
                                    <span className="fa-2x">PSI</span>
                                    <span className="fa-2x fa mx-2 fa-html5"></span>
                                </div>
                            </span>
                            <div className="text-capitalize col-d-none col-sm-d-block">
                                <span onClick = {this.scrollToSection} data-custom-target = "purpose-section" className="mx-3 cursor-pointer">Project Objectives</span>
                                <span onClick = {this.scrollToSection} data-custom-target = "owner-section" className="mx-3 cursor-pointer">Ownership</span>
                                <span onClick = {this.scrollToSection} data-custom-target = "run-test-section" className="py-2 px-3 border rounded cursor-pointer mx-3 bold">Run Test</span>
                            </div>
                            <div className="col-sm-d-none px-3" onClick={
                                () => {
                                    let state = this.state.mobileMenuOpen;
                                    this.setState({
                                        mobileMenuOpen: !state
                                    });
                                }}>
                                <span className={"fa fa-2x text-white" + ((this.state.mobileMenuOpen) ? " fa-close" : " fa-bars")}></span>
                            </div>
                            <div className="col-sm-d-none px-3 po-abs overflow-0 transit left-0 w-100 bg-dark" style={{top: "100%", height: ((this.state.mobileMenuOpen) ? "240px" : "0"), zIndex: "1000"}}>
                                <div className="py-4">
                                    <div className="p-3 py-4 text-c">
                                        <span onClick = {this.scrollToSection} data-custom-target = "purpose-section" className="text-capitalize bold">Project Purpose</span>
                                    </div>
                                    <div className="p-3 py-4 text-c">
                                        <span onClick = {this.scrollToSection} data-custom-target = "owner-section" className="text-capitalize bold">Owner Info</span>
                                    </div>
                                    <div className="p-3 py-4 text-c">
                                        <span onClick = {this.scrollToSection} data-custom-target = "run-test-section" className="text-capitalize bold bg-white text-dark p-3 d-block rounded-lg">Run Test</span>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                </header>
                <main className="px-4 py-5 bg-white" data-targeted = "run-test-section">
                    <div className="flex-h text-c py-4">
                        <p className="bold thick-border-bottom d-inline-block mx-auto fa-2x my-2 text-capitalize text-c">
                            run test
                        </p>
                    </div>
                    <div id="password_analysis_display" className="container-fluid flex-h flex-wrap mx-auto">
                        <div className="col-12 col-md-7 my-4 col-lg-8">
                            <div className="pr-4 pl-0 po-rel py-5 border shadow-sm overflow-y-auto" style={{borderRadius: "10px"}}>
                                <div style={{height: this.state.rezHeight + "px", maxWidth: "500px"}} className="mx-auto flex-h" id = "rez">
                                    <div className="h-100 po-rel flex-v text-r" style={{width: "45px"}}>
                                        <span style={{top: 0, right: "4px", transform: "translate(0, -50%)"}} className="bold po-abs">100%</span>
                                        <span style={{top: "25%", right: "4px", transform: "translate(0, -50%)"}} className="bold po-abs">75%</span>
                                        <span style={{top: "50%", right: "4px", transform: "translate(0, -50%)"}} className="bold po-abs">50%</span>
                                        <span style={{top: "75%", right: "4px", transform: "translate(0, -50%)"}} className="bold po-abs">25%</span>
                                        <span style={{top: "100%", right: "4px", transform: "translate(0, -50%)"}} className="bold po-abs">0%</span>
                                    </div>
                                    <div className="graph-container h-100 flex-1 po-rel border-bottom border-left border-secondary">
                                        <div title = {"Password strength: " + ((this.state.passwordTest.score === 0) ? "0%" : (this.state.passwordTest.score / 4) * 100 + "%")} className="bg-warning transit po-abs" style={{width: "2%", transform: "translate(-50%, 0)", height: ((this.state.passwordTest.score !== 0) ? this.state.passwordTest.score / 4 : 0.02) * 100 + "%", left: "10%", borderTopRightRadius: "3px", bottom: 0, borderTopLeftRadius: "3px"}}></div>

                                        <div title = {"Password length: " + this.state.passwordTest.character_length + " character(s)"} className="bg-success transit po-abs" style={{width: "2%", transform: "translate(-50%, 0)", height: ((this.state.passwordTest.character_length) ? 10 : 0.2) * 10 + "%", left: "30%", borderTopRightRadius: "3px", bottom: 0, borderTopLeftRadius: "3px"}}></div>

                                        <div title = {"Uppercase characters: " + this.state.passwordTest.uppercase_chars + " character(s)"} className="bg-danger transit po-abs" style={{width: "2%", transform: "translate(-50%, 0)", height: ((this.state.passwordTest.uppercase_chars) ? (this.state.passwordTest.uppercase_chars / this.state.passwordTest.character_length) * 10 : 0.2) * 10 + "%", left: "50%", borderTopRightRadius: "3px", bottom: 0, borderTopLeftRadius: "3px"}}></div>

                                        <div title = {"Lowercase characters: " + this.state.passwordTest.lowercase_chars + " character(s)"} className="bg-primary transit po-abs" style={{width: "2%", transform: "translate(-50%, 0)", height: ((this.state.passwordTest.lowercase_chars) ? (this.state.passwordTest.lowercase_chars / this.state.passwordTest.character_length) * 10 : 0.2) * 10 + "%", left: "70%", borderTopRightRadius: "3px", bottom: 0, borderTopLeftRadius: "3px"}}></div>

                                        <div title = {"Special characters: " + this.state.passwordTest.special_chars + " character(s)"} className="bg-secondary transit po-abs" style={{width: "2%", transform: "translate(-50%, 0)", height: ((this.state.passwordTest.special_chars) ? (this.state.passwordTest.special_chars / this.state.passwordTest.character_length) * 10 : 0.2) * 10 + "%", left: "90%", borderTopRightRadius: "3px", bottom: 0, borderTopLeftRadius: "3px"}}></div>
                                    </div>

                                </div>
                                <div className="po-abs" style={{right: "3%", top: "3%"}}>
                                    <div onClick = {this.openLegendTab} className={"po-rel cursor-pointer bg-success flicker flex-h j-c-c a-i-c p-2 rounded-lg text-secondary"}>
                                        <span className="fa fa-bars mr-2 mt-1 text-white pointer-events-0" style={{lineHeight: "100%"}}></span>
                                        <span className="bold letter-spacing-1 text-white pointer-events-0">Legends{this.state.legendTabOpen}</span>
                                    </div>
                                    <div tabIndex="1" id = "legend-tab" className={"po-abs shadow bg-white border outline-0 rounded-lg" + ((this.state.legendTabOpen) ? "" : " d-none")} style={{bottom: "0", transform: "translateY(110%)", minWidth: "200%", right: "0"}}>
                                        <div className="p-3 flex-h j-c-c a-i-c cursor-pointer" title = "Password Strength">
                                            <span className = "fa mr-3 fa-circle text-warning"></span>
                                            <span className = "text-capitalize single-line flex-1 bold">password strength</span>
                                        </div>
                                        <div className="p-3 flex-h j-c-c a-i-c cursor-pointer" title = "Character Length">
                                            <span className = "fa mr-3 fa-circle text-success"></span>
                                            <span className = "text-capitalize single-line flex-1 bold">character length</span>
                                        </div>
                                        <div className="p-3 flex-h j-c-c a-i-c cursor-pointer" title = "Uppercase Characters">
                                            <span className = "fa mr-3 fa-circle text-danger"></span>
                                            <span className = "text-capitalize single-line flex-1 bold">uppercase characters</span>
                                        </div>
                                        <div className="p-3 flex-h j-c-c a-i-c cursor-pointer" title = "Lowercase Characters">
                                            <span className = "fa mr-3 fa-circle text-primary"></span>
                                            <span className = "text-capitalize single-line flex-1 bold">lowercase characters</span>
                                        </div>
                                        <div className="p-3 flex-h j-c-c a-i-c cursor-pointer" title = "Symbols & Digits">
                                            <span className = "fa mr-3 fa-circle text-dark"></span>
                                            <span className = "text-capitalize single-line flex-1 bold">symbols & digits</span>
                                        </div>
                                    </div>
                                </div>
                                <div className = "px-3 w-100 pt-5">
                                    <div className = "flex-h cursor-pointer px-3" onClick = {this.seeMore}>
                                        <span className = "flex-1 single-line text-capitalize bold">see more <span className = {"fa fa-chevron-" + ((this.state.seeMore) ? "up" : "down")}></span></span>
                                    </div>
                                    <div className = {"p-3 " + ((this.state.seeMore) ? "" : "d-none")}>
                                        <div className = "overflow-x-auto">
                                            <table border="1" className = "table border table-striped table-hover">
                                                <thead className = "bg-dark bold text-capitalize text-white">
                                                    <tr>
                                                        <td>property</td>
                                                        <td>content</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className = "text-capitalize">password</td>
                                                        <td>
                                                            {this.passwordTestAnalysis().password}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className = "text-capitalize">password strength</td>
                                                        <td>
                                                            {this.passwordTestAnalysis().password_strength}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className = "text-capitalize">suggestions</td>
                                                        <td>
                                                            {this.passwordTestAnalysis().suggestions}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className = "text-capitalize">warnings</td>
                                                        <td>
                                                            {this.passwordTestAnalysis().warnings}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className = "text-capitalize">guesses</td>
                                                        <td>
                                                            {this.passwordTestAnalysis().guesses}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className = "text-capitalize">crack sequence</td>
                                                        <td>
                                                            {this.passwordTestAnalysis().crack_sequence}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-5 my-4 col-lg-4">
                            <div className="px-4 py-5 border shadow-sm" style={{borderRadius: "10px"}}>
                                <p className="text-c text-capitalize bold text-secondary">enter password</p>
                                <div className="border border-secondary mb-3 flex-h j-c-c a-i-c">
                                    <input onChange={this.automaticTest} id= "password" placeholder = "Type password here" type = {this.state.inputType} className="outline-0 rounded p-3 d-block border-0 w-100" />

                                    <span title = "Copy password" className={"fa pr-3 py-3 fa-clipboard " + ((this.state.clipboardSaved) ? "text-primary" : "")} onClick = {
                                        () => {
                                            if(!this.state.clipboardSaved && this.state.password.length > 0){
                                                let password = this.state.password;
                                                window.navigator.clipboard.writeText(password);

                                                this.setState({
                                                    clipboardSaved: true
                                                });

                                                alert("Password saved to clipboard.")
                                            }
                                        }
                                    }></span>

                                    <span title = "View password" className={"fa pr-3 py-3 " + ((this.state.inputType !== "password") ? "fa-eye text-primary" : "fa-eye-slash")} onClick = {
                                        () => {
                                            let a = this.state.inputType;
                                            if(a === "password"){
                                                this.setState({
                                                    inputType: "text"
                                                });
                                            }
                                            else{
                                                this.setState({
                                                    inputType: "password"
                                                });
                                            }
                                        }
                                    }></span>
                                </div>
                                <div>
                                    <input onClick = {this.testPassword} type = "button" value={this.state.testButtonText} className={"btn btn-success p-3 d-block transit text-uppercase bold w-100 " + ((this.state.testButtonText !== "testing") ? "" : "disabled")}/>
                                </div>
                                <div onClick = {this.toggleAutoTest} className={"mt-3 cursor-pointer" + ((this.state.autoTest) ? " text-primary" : " text-secondary")}>
                                    <span className={"pointer-events-0 fa mr-2" + ((this.state.autoTest) ? " fa-toggle-on" : " fa-toggle-off")}></span>
                                    <span className="pointer-events-0 bold">Automatically test passwords?</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <main className="bg-dark text-white py-5 px-3" data-targeted = "purpose-section">
                    <div className="px-2 text-c">
                        <p className="bold thick-border-bottom d-inline-block mx-auto fa-2x my-2 text-capitalize text-c">
                            Project Objectives
                        </p>
                    </div>
                    <div className="my-4 container">
                        <div className="mb-4">
                            <div className="mt-1">
                                <p>
                                    Passwords are a vital component of system security. The big vulnerability of passwords lie in their nature. Research and analysis of password strength recognition using machine learning classification algorithms:
                                </p>
                                <ul>
                                    <li>
                                        Model password strength prediction, strong or weak password test.
                                    </li>
                                    <li>
                                        To evaluate the strength of password combinations, user can use the immediate visual feedback to increase the strength of their passwords, with a special emphasis on breaking the common umhealthy habits of poor password construction.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
                <main className="bg-white text-dark py-5 px-3" data-targeted = "owner-section">
                    <div className="px-2 text-c">
                        <p className="bold thick-border-bottom d-inline-block mx-auto fa-2x my-2 text-capitalize text-c">
                            Ownership
                        </p>
                    </div>
                    <div className="my-4 container">
                        <div className="mb-4 border-bottom">
                            <div className="text-capitalize bold letter-spacing-1">name:</div>
                            <div className="text-capitalize mt-1">Ahmed Mariam Damilola</div>
                        </div>
                        <div className="mb-4 border-bottom">
                            <div className="text-capitalize bold letter-spacing-1">matric number:</div>
                            <div className="text-capitalize mt-1">17/52HL020</div>
                        </div>
                        <div className="mb-4 border-bottom">
                            <div className="text-capitalize bold letter-spacing-1">Supervisor:</div>
                            <div className="text-capitalize mt-1">Dr. A. M. Adeshina</div>
                        </div>
                        <div className="mb-4 border-bottom">
                            <div className="text-capitalize bold letter-spacing-1">Department:</div>
                            <div className="text-capitalize mt-1">information & communication science</div>
                        </div>
                        <div className="mb-4 border-bottom">
                            <div className="text-capitalize bold letter-spacing-1">Institution:</div>
                            <div className="text-capitalize mt-1">university of ilorin</div>
                        </div>
                    </div>
                </main>
                <footer className="bg-dark text-white py-5 px-3">
                    <div className="px-2">
                        <p className="bold fa-2x my-2 text-capitalize text-c">
                            password strength recognition using<br />machine learning classification algorithm
                        </p>
                        <p className="text-c text-capitalize">this web application tests password strength and returns an analysis</p>
                    </div>
                    <div className="container px-0 flex-h flex-wrap">
                        <div className="col-12 px-3 text-c mt-3 text-capitalize underline">
                            designed and developed &copy; 2021
                        </div>
                    </div>
                </footer>
            </section>
        );
    }
}

export default App;
