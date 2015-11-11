"use strict";

var mazeSize = 10;
var N = mazeSize + 1, M = mazeSize;  // create a 10 * 10 maze;
var sideLength = 48;
var moveX = [-1, 0, 1, 0];
var moveY = [0, 1, 0, -1];
var visited = [];
var stack = [];
var shouldPass = [];
var passCounter;
var visCounter = 0;
var i, j;
var gameRunning;
var time;

for (i = 0; i < mazeSize; ++i) {
    visited[i] = [];
    for (j = 0; j < mazeSize; ++j) {
        visited[i][j] = false;
    }
}

$(document).ready(function () {
    createBlocks();
    placeBlocks();
    dfs(0, 0);
    init();
});

function createBlocks() {
    var container = $(".container");
    for (i = 0; i < N; ++i) {
        for (j = 0; j < M; ++j) {
            var horBlock = $("<div></div>");
            horBlock.addClass("horizontal block");
            container.append(horBlock);
        }
    }
    for (i = 0; i < N - 1; ++i) {
        for (j = 0; j < M + 1; ++j) {
            var verBlock = $("<div></div>");
            verBlock.addClass("vertical block");
            container.append(verBlock);
        }
    }
}

function placeBlocks() {
    var nowY, nowX;

    var horizons = $(".horizontal");
    nowY = 0;
    nowX = 0;
    for (i = 0; i < N; ++i) {
        for (j = 0; j < M; ++j) {
            horizons.eq(i * M + j).css({"left": nowY + "px", "top": nowX + "px"});
            nowY += sideLength;
        }
        nowY = 0;
        nowX += sideLength + 1;
    }

    var verticals = $(".vertical");
    nowY = 0;
    nowX = 0;
    for (i = 0; i < N - 1; ++i) {
        for (j = 0; j < M + 1; ++j) {
            verticals.eq(i * (M + 1) + j).css({"left": nowY + "px", "top": nowX + "px"});
            nowY += sideLength;
        }
        nowY = 0;
        nowX += sideLength + 1;
    }

    verticals.eq(0).hide();
    verticals.eq(verticals.length - 1).hide();
}

function init() {
    var timer = 0;

    var blocks = $(".block");
    for (var i = 0; i < blocks.length - 1; i++) {  // except the last one
        blocks.eq(i).mouseover(function () {
            if (gameRunning && !$(this).hasClass("invisibleBlock")) {
                $(this).addClass("newBlock");
                gameRunning = false;
                $("#display").html("You lose!");
                clearInterval(timer);
            }
        });
    }

    $("#start").mouseover(function () {
        gameRunning = true;
        for (var i = 0; i < blocks.length - 1; i++) {
            blocks.eq(i).removeClass("newBlock");
        }
        passCounter = 0;
        time = 0;
        clearInterval(timer);
        timer = setInterval(refleshDisplay, 1000);
    });

    $("#end").mouseover(function () {
        if (gameRunning && passCounter > shouldPass.length * 0.9) {  // sometimes the mouse move too fast
            $("#display").html("You win within " + time + "s!");
        } else {
            $("#display").html("Don't cheat, you should start form the 'S' and move to the 'E' inside the maze!");
        }
        gameRunning = false;
        clearInterval(timer);
    });

    var invisibleBlocks = $(".invisibleBlock");
    for (i = 0; i < invisibleBlocks.length; ++i) {
        invisibleBlocks.eq(i).mouseover(function () {
            for (j = 0; j < shouldPass.length; ++j) {
                if ($(this).css("top") == shouldPass[j].css("top") && $(this).css("left") == shouldPass[j].css("left")) {
                    console.log("right!");
                    ++passCounter;
                    break;
                }
            }
        });
    }
}

function refleshDisplay() {
    $("#display").html("Game started, go head! Used time: " + ++time + "s.");
}

function dfs(x, y) {
    // console.log(x, y);
    var horizons = $(".horizontal");
    var verticals = $(".vertical");
    var direction, newx, newy;

    if (x == mazeSize - 1 && y == mazeSize - 1) {
        for (i = 0; i < stack.length; ++i) {
            shouldPass.push(stack[i]);
        }
    }
    visited[x][y] = true;
    ++visCounter;
    if (visCounter == mazeSize * mazeSize)
        return;

    var target;
    while (countValid(x, y)) {
        do {
            direction = Math.floor(Math.random() * 4);
            newx = x + moveX[direction];
            newy = y + moveY[direction];
        } while (!isValid(newx, newy));
        switch (direction) {
        case 0:
            target = horizons.eq(x * mazeSize + y);
            break;
        case 1:
            target = verticals.eq(x * (mazeSize + 1) + y + 1);
            break;
        case 2:
            target = horizons.eq((x + 1) * mazeSize + y);
            break;
        case 3:
            target = verticals.eq(x * (mazeSize + 1) + y);
            break;
        }
        stack.push(target);
        target.addClass("invisibleBlock");
        dfs(newx, newy);
        stack.pop();
    }
}

function isValid(x, y) {
    return x >= 0 && y >= 0 && x < mazeSize && y < mazeSize && !visited[x][y];
}

function countValid(x, y) {
    var newx, newy, counter = 0;
    for (i = 0; i < 4; ++i) {
        newx = x + moveX[i];
        newy = y + moveY[i];
        if (isValid(newx, newy))
            ++counter;
    }
    return counter;
}

