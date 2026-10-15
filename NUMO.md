## NUMØ  
## An Experimental Game of Probability  
## Project Identity  
**Project Name:** NUMØ **Project Type:** Interactive Browser Game **Genre:** Number Guessing / Experimental Digital Experience **Players:** Single Player **Platform:** Modern Desktop and Mobile Browsers **Development Environment:** Visual Studio Code + Live Server  
  
## 1. PROJECT OVERVIEW  

NUMØ is a visually experimental, single-player number-guessing game.  
The player must identify a randomly generated integer between 1 and 100 within five valid attempts.  
The core gameplay must remain intuitive, accessible, and easy to understand.  
However, the visual experience should be sophisticated, artistic, immersive, and highly interactive.  
The design should meet the level of craftsmanship associated with exceptional experimental websites and Awwwards-caliber digital experiences.  

The objective is to combine:  
* Simple, intuitive gameplay  
* Exceptional visual design  
* Experimental typography  
* Generative motion  
* Morphing numbers, letters, and symbols  
* Responsive interactions  
* Accessible user experience  
* Clean, maintainable code  

The final result should feel like an interactive digital art installation rather than a conventional browser game.  
  
## 2. TECHNOLOGY STACK  

Build the application using:  
* HTML5  
* CSS3  
* Vanilla JavaScript (ES6+)  
* SVG where appropriate  
* CSS animations and transitions  
* Web Animations API where appropriate  

Do not use React, Next.js, Vue, Angular, or other JavaScript frameworks.  
Do not introduce unnecessary dependencies.  
Lightweight animation libraries may be proposed if they provide a meaningful benefit, but request approval before adding them.  
The application must run locally using Live Server.  
No backend or database is required.  
## File Structure  
Use separate files for each language.  
numo/ ├── index.html ├── css/ │ └── styles.css ├── js/ │ ├── game.js │ ├── animations.js │ └── main.js ├── assets/ │ ├── fonts/ │ ├── icons/ │ └── audio/ ├── README.md └── CLAUDE.md  
Do not embed substantial CSS or JavaScript directly inside the HTML document.  
  
## 3. GAME OBJECTIVE  

The player must guess a randomly generated integer between 1 and 100.  
The player has five valid attempts.  
The player wins by guessing the number correctly.  
The player loses after five incorrect valid guesses.  
The game must never require more than five valid guesses to determine a win or loss.  
  
## 4. GAME INITIALIZATION  

When the application loads:  
1. Display the game's introductory interface.  
2. Generate a random integer between 1 and 100.  
3. Set remaining attempts to five.  
4. Clear previous guess history.  
5. Display the number of remaining attempts.  
6. Enable the guess input.  
7. Display clear instructions.  

Generate the secret number using JavaScript.  
The secret number must be an integer within the inclusive range of 1 through 100.  
Do not reveal the secret number during gameplay.  
  
## 5. PLAYER INPUT  

Provide a clearly labeled input field.  

The player must be able to:  
* Enter a number.  
* Submit using a button.  
* Submit using the Enter key.  
* See immediate feedback.  
* Correct invalid input.  

The input should automatically receive focus when appropriate, without unexpectedly interrupting mobile users.  
## Input Validation  

Only accept whole integers between 1 and 100.  

Reject:  
* Empty submissions  
* Letters  
* Special characters  
* Decimal numbers  
* Negative numbers  
* Zero  
* Numbers greater than 100  
* Non-numeric input  
* Previously submitted guesses  

Invalid input must:  
1. Display a clear explanation.  
2. Preserve the remaining attempt count.  
3. Avoid changing the guess history.  
4. Allow the player to try again.  

Repeated guesses must not consume an attempt.  
Provide a message such as:  
"You've already tried that number."  
Never punish a player for invalid input.  
  
## 6. GUESS EVALUATION  

When a valid guess is submitted:  
1. Verify the game is active.  
2. Verify the input is valid.  
3. Verify the number has not been guessed previously.  
4. Record the guess.  
5. Decrease remaining attempts by one.  
6. Compare the guess against the secret number.  
7. Display the appropriate feedback.  
8. Update the interface.  
## Too High  
If the guess is greater than the secret number:  
Display:  
"TOO HIGH"  
Use a distinctive visual response.  
## Too Low  
If the guess is less than the secret number:  
Display:  
"TOO LOW"  
Use a distinctive visual response.  
## Correct  
If the guess equals the secret number:  
Display:  
"CORRECT"  
Immediately transition to the winning state.  
  
## 7. GAME STATE  

Implement a clear state-management system.  

The game must support:  
* READY  
* PLAYING  
* WON  
* LOST  

Track:  
* Secret number  
* Remaining attempts  
* Previous guesses  
* Current game state  

Prevent additional guesses after the game ends.  
Prevent duplicate submissions while a guess is being processed.  
All displayed information must accurately reflect the current game state.  
Keep the game logic separate from animation logic.  
Animations must never determine gameplay outcomes.  
  
## 8. GUESS HISTORY  

Display previously submitted valid guesses.  
The history should:  
* Show each guessed number.  
* Preserve submission order.  
* Indicate whether a guess was too high or too low.  
* Update immediately after a valid submission.  
* Clear when a new game begins.  

Present the history using a sophisticated typographic layout.  
Avoid conventional tables unless they meaningfully improve the experience.  
  
## 9. ATTEMPT COUNTER  

Display the number of attempts remaining.  
Initial value: 5  
Decrease the value only after a valid, previously unused guess.  
Never allow the counter to become negative.  
The counter must remain visible throughout gameplay.  
Use motion and typography to communicate changes.  
The number should animate when an attempt is consumed.  
  
## 10. WINNING  

The player wins when the secret number is guessed within five valid attempts.  
When the player wins:  
1. Immediately stop accepting guesses.  
2. Set the game state to WON.  
3. Display a custom result dialog.  
4. Display the winning number.  
5. Display a congratulatory message.  
6. Trigger a distinctive winning animation.  

Use expressive typography and restrained, high-quality motion.  
The winning experience should feel rewarding without becoming visually overwhelming.  
  
## 11. LOSING  

The player loses when all five attempts are consumed without identifying the secret number.  

When the player loses:  
1. Immediately stop accepting guesses.  
2. Set the game state to LOST.  
3. Display a custom result dialog.  
4. Reveal the correct number.  
5. Display an appropriate message.  
6. Trigger a distinctive losing animation.  

The losing experience should feel intentional and visually compelling.  
Avoid mocking or discouraging the player.  
  
## 12. RESULT DIALOG  

Use a custom-designed accessible modal dialog.  
Do not use the browser's default alert() function.  
The modal must:  
* Clearly identify whether the player won or lost.  
* Display the correct number.  
* Include a clearly labeled button to continue.  
* Support keyboard interaction.  
* Manage focus correctly.  
* Prevent interaction with the background while open.  

Closing or continuing from the result dialog must automatically start a new game.  
Reset all gameplay information.  
Generate a new random number.  
Re-enable the input.  
Restore the remaining attempt count to five.  
The new number may coincidentally match a previous game's number because each game uses an independent random selection.  
Do not implement an unnecessary restriction against consecutive identical secret numbers.  
  
## 13. DESIGN PHILOSOPHY  

The design must be:  
* Experimental  
* Editorial  
* Minimalist  
* Immersive  
* Typographically expressive  
* Visually distinctive  
* Accessible  
* Responsive  
* Artistically sophisticated  

Avoid generic gaming interfaces.  
Avoid conventional dashboard layouts.  
Avoid unnecessary cards, panels, and decorative containers.  
Favor intentional composition, typography, negative space, rhythm, and motion.  
Every design element should serve a purpose.  
The application should feel like a cohesive interactive artwork.  
  
## 14. BRAND IDENTITY  
## Name  
NUMØ  
## Tagline  
AN EXPERIMENTAL GAME OF PROBABILITY  
## Visual Personality  

The brand should communicate:  
* Mystery  
* Intelligence  
* Precision  
* Curiosity  
* Experimentation  
* Playfulness  

The visual language should combine experimental typography with a disciplined editorial grid.  
Use asymmetrical layouts where appropriate.  
Balance expressive motion with clear usability.  
  
## 15. COLOR SYSTEM  

Use the following design tokens.  
Primary Accent: Electric Chartreuse ++#D7FF3F++  
Complementary Accent: Ultraviolet ++#5528E8++  
Background: Near Black ++#09090D++  
Secondary Surface: Graphite ++#17171D++  
Primary Text: Warm White ++#F4F2ED++  
Secondary Text: Muted Silver ++#9999A5++  
Error Accent: Coral Red ++#FF626B++  
## Color Usage  

Use near-black as the dominant background.  
Use warm white for primary typography.  
Use chartreuse to emphasize interaction, progress, and successful outcomes.  
Use ultraviolet to represent uncertainty, hidden information, and experimental motion.  
Use coral sparingly for validation errors and selected losing-state details.  
Avoid excessive gradients.  
Ensure sufficient contrast for readable text, interactive controls, and essential game information.  
Do not rely exclusively on color to communicate whether a guess is too high, too low, or correct.  
  
## 16. TYPOGRAPHY  

Typography is a central part of the experience.  
Treat letters, numbers, and symbols as expressive visual objects.  
Use:  
* Oversized display typography  
* Experimental editorial compositions  
* Strong typographic hierarchy  
* Variable font techniques  
* Controlled letter spacing  
* Contrasting font weights  
* Responsive typography  
* Animated numerical characters  

Prefer a distinctive variable display typeface paired with a highly legible supporting typeface. Use properly licensed fonts. Do not use copyrighted commercial fonts without permission.  
## Morphing Typography  

Create morphing transitions involving:  
* Numbers  
* Letters  
* Mathematical symbols  
* Interface labels  

Examples:  
Numbers may interpolate between different typographic shapes.  
The game title may subtly transform during introductory animations.  
The remaining-attempt counter may animate between numerical values.  
Feedback messages may emerge through character transformations.  
Morphing effects must remain legible at the moment information is needed.  
Do not use continuous chaotic animations that interfere with gameplay.  
  
## 17. ANIMATION SYSTEM  

Animations should be expressive but intentional.  

Use animation to communicate:  
* Game initialization  
* Guess submission  
* High or low feedback  
* Remaining attempts  
* Winning  
* Losing  
* Game reset  
## Motion Principles  

Use smooth, carefully tuned transitions.  
Avoid excessive bouncing.  
Avoid arbitrary movement.  
Avoid constant visual distractions.  

Use motion to reinforce the player's understanding of the interface.  
Prefer performant CSS transforms and opacity changes.  
Avoid unnecessary layout recalculations.  
## Reduced Motion  

Respect the user's reduced-motion preferences.  
When reduced motion is enabled:  
* Disable decorative morphing.  
* Remove unnecessary transitions.  
* Preserve essential feedback.  
* Ensure the game remains fully usable.  

The experience must never depend on animation for understanding gameplay.  
  
## 18. INTERACTION DESIGN  

The interface should feel responsive and precise.  
Buttons should provide clear feedback for:  
* Hover  
* Focus  
* Press  
* Disabled states  

Input interactions should feel intentional.  
Use subtle motion to reinforce successful actions.  
Avoid animations that delay gameplay unnecessarily.  
Ensure touch targets are comfortable on mobile.  
Do not make hover interactions necessary to access essential functionality.  
  
## 19. RESPONSIVE DESIGN  

Support:  
* Desktop  
* Laptop  
* Tablet  
* Mobile  

The design should adapt intelligently.  
Do not simply shrink the desktop interface to fit smaller screens.  
Reconsider typography, spacing, and composition for different viewport sizes.  
Maintain clear visual hierarchy.  
Prevent horizontal overflow.  
Ensure the input, attempt counter, and feedback remain easy to access.  
  
## 20. ACCESSIBILITY  

Accessibility is a core requirement.  
Implement:  
* Semantic HTML  
* Proper input labels  
* Keyboard navigation  
* Visible focus indicators  
* Accessible validation messages  
* Accessible modal behavior  
* Appropriate ARIA attributes  
* Sufficient text contrast  
* Reduced-motion support  

Ensure that feedback is understandable without relying on color or animation.  
Use an appropriate live region to announce guess feedback to assistive technology.  
The application must remain usable without a mouse.  
  
## 21. PERFORMANCE  

Prioritize performance and responsiveness.  
Avoid unnecessarily large libraries.  
Optimize animation performance.  
Minimize unnecessary DOM updates.  
Avoid expensive continuous animation loops unless clearly justified.  
Use requestAnimationFrame where appropriate.  
Ensure animations pause or reduce activity when the page is not visible.  
The application should remain responsive on modern mobile devices.  
  
## 22. CODE QUALITY  

Write readable, maintainable JavaScript.  
Use descriptive variable and function names.  
Separate:  
* Game logic  
* DOM interactions  
* Animation behavior  
Avoid unnecessary abstraction.  
Avoid duplicated logic.  
Use functions with clear responsibilities.  
Comment complex behavior where explanation is genuinely useful.  
Do not add comments that merely repeat what the code already says.  
Use consistent formatting.  
  
## 23. TESTING REQUIREMENTS  

Test the following scenarios:  
1. A new game generates a number from 1 to 100.  
2. The initial attempt counter displays five.  
3. A valid incorrect guess consumes one attempt.  
4. An invalid guess consumes no attempts.  
5. A duplicate guess consumes no attempts.  
6. A correct guess triggers the winning state.  
7. Five incorrect guesses trigger the losing state.  
8. The losing dialog reveals the correct number.  
9. Closing the result dialog starts a new game.  
10. Starting a new game resets all gameplay information.  
11. Enter submits a valid guess.  
12. Additional guesses cannot be submitted after game completion.  
13. Keyboard navigation works correctly.  
14. The interface remains usable on mobile.  
15. Reduced-motion preferences are respected.  

Use Playwright for automated browser testing where practical.  
Do not consider the project complete until the primary gameplay flows have been tested.  
  
## 24. DEVELOPMENT WORKFLOW  

Follow this process:  
DEFINE Understand the requirements.  
EXPLORE Inspect the existing project.  
PLAN Determine the implementation approach.  
CODE Implement the required functionality.  
REVIEW Inspect and test the result.  
COMMIT Record a meaningful project state.  
Do not skip planning for major features.  
Before making architectural changes, explain the proposed approach.  
Do not add unnecessary features.  
Do not change the game's fundamental rules without explicit approval.  
  
## 25. PROJECT CONSTRAINTS  

The application must remain:  
* Single-player  
* Browser-based  
* Free to play  
* Functional without a backend  
* Focused on guessing numbers from 1 to 100  
* Limited to five valid attempts  

Do not introduce:  
* User accounts  
* Multiplayer  
* Leaderboards  
* Payments  
* Advertising  
* Unnecessary external services  
* Unrequested gameplay mechanics  
Creative freedom is encouraged in visual design, typography, motion, and interaction.  
Creative freedom must not alter the established gameplay rules.  
  
## 26. DEFINITION OF DONE  
The project is complete when:  
* All required gameplay mechanics function correctly.  
* Input validation handles expected edge cases.  
* Game state remains consistent.  
* Win and loss conditions work.  
* The game resets correctly.  
* The interface is responsive.  
* Essential accessibility requirements are met.  
* Animations are performant.  
* Reduced-motion behavior is supported.  
* The visual design follows the brand direction.  
* The code is organized and maintainable.  
* The application runs locally using Live Server.  
* Primary interactions have been tested.  
* No known critical bugs remain.  

The finished application should demonstrate both reliable engineering and exceptional creative execution.  
