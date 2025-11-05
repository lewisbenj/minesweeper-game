# 💣 **Minesweeper Extreme** 💣

> A modern, highly challenging, and fully responsive implementation of the classic Minesweeper game using pure HTML, CSS, and JavaScript.



## ✨ **Features**

* **Extreme Difficulty:** Configured by default for the `16x30` grid with `99` mines (Expert level).
* **Safe First Click:** Guarantees that the first move will never hit a mine.
* **Responsive Design:** Optimized layout and cell size for seamless gameplay on both **desktop and mobile devices** (via CSS Media Queries).
* **Flood-Fill Recursion:** Automatically opens adjacent empty cells.
* **Interactive Controls:** Flag placement (Right-click/Long press) and mine counter.
* **Victory Modal:** A clean pop-up displays the completion time upon winning.

## 🕹️ **How to Play**

1.  **Open the Game:** Simply open `index.html` in your web browser.
2.  **Start:** Click on any cell to begin the game and start the timer.
3.  **Clear Cells:** Left-click to reveal a cell. If the cell has a number, it indicates how many mines are adjacent to it.
4.  **Mark Mines:** Right-click (or long-press on mobile) to place a flag (`🚩`) on a suspected mine location.
5.  **Win:** Clear all non-mine cells to win!

## ⚙️ **Technologies Used**

This project is built using foundational web technologies without any external frameworks or libraries, showcasing clean, vanilla code.

* **HTML5:** Structure and organization of the game.
* **CSS3:** Styling, grid layout, and responsive design (Media Queries).
* **JavaScript (ES6+):** Game logic, mine placement algorithm, click handlers, and game state management.

## 🚀 **Getting Started (For Developers)**

To run this project locally, simply clone this repository and open the main HTML file:

```bash
# 1. Clone the repository
git clone https://github.com/lewisbenj/minesweeper-game
cd Minesweeper-Extreme

# 2. Open in your browser
open index.html 
# OR use a live server extension in your code editor
