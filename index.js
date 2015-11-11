"use strict";

var mazeSize = 10;
var N = mazeSize + 1, M = mazeSize;  // create a 10 * 10 maze;
var sideLength = 48;
var moveX = [-1, 0, 1, 0];
var moveY = [0, 1, 0, -1];
var visited = [];
var visCounter = 0;
var i, j;
var gameRunning;

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
    var blocks = $(".block");
    for (var i = 0; i < blocks.length - 1; i++) {  // except the last one
        blocks.eq(i).mouseover(function () {
            if (gameRunning) {
                $(this).addClass("newBlock");
                gameRunning = false;
                $("#display").html("You lose!");
            }
        });
    }

    $("#start").mouseover(function () {
        gameRunning = true;
        for (var i = 0; i < blocks.length - 1; i++) {
            blocks.eq(i).removeClass("newBlock");
        }
        $("#display").html("Game started, go head!");
    });

    $("#end").mouseover(function () {
        if (gameRunning) {
            gameRunning = false;
            $("#display").html("You Win!");
        }
    });


}

function dfs(x, y) {
    // console.log(x, y);
    var horizons = $(".horizontal");
    var verticals = $(".vertical");
    var direction, newx, newy;

    visited[x][y] = true;
    ++visCounter;
    if (visCounter == mazeSize * mazeSize)
        return;

    while (countValid(x, y)) {
        do {
            direction = Math.floor(Math.random() * 4);
            newx = x + moveX[direction];
            newy = y + moveY[direction];
        } while (!isValid(newx, newy));
        switch (direction) {
        case 0:
            horizons.eq(x * mazeSize + y).hide();
            break;
        case 1:
            verticals.eq(x * (mazeSize + 1) + y + 1).hide();
            break;
        case 2:
            horizons.eq((x + 1) * mazeSize + y).hide();
            break;
        case 3:
            verticals.eq(x * (mazeSize + 1) + y).hide();
            break;
        }
        dfs(newx, newy);
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