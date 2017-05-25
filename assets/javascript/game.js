/* Star Wars RPG game js */
/*   Don Bedwell 2017    */

// define variables

var btnAttack = document.getElementById("attack");
var btnReset  = document.getElementById("reset");
btnAttack.disabled = true;
btnReset.disabled = true;

// define game object
var game = {
	myHero: "",
	myEnemy: "",
	turnCount: 0,
	enemyCount: 3,
	rndHit: "",
	chosenOne: false,
	chosenEnemy: false,

	instructions: ["choose your hero", "choose your enemy", "choose your next enemy", "fight!", "you are victorious!", "you are defeated"],

	displayInstructions: function(when){
		$('#instructions').html("<h1>" + game.instructions[when] + "</h1>");
	},

	coinFlip: function(){
	//who hits first?
    return (Math.floor(Math.random() * 2) == 0) ? game.myHero : game.myEnemy;
	},

	checkWinner: function(){
		if((game.characters[this.myHero].hit <= 0) || (game.characters[this.myEnemy].hit <= 0)){
			if(game.characters[this.myHero].hit <= 0){
				var txt = game.characters[this.myEnemy].name + " wins!";
				$('#' + game.characters[this.myHero].id).remove();
				game.displayInstructions(5);
			}
			else if (game.characters[this.myEnemy].hit <= 0){
				var txt = game.characters[this.myHero].name + " wins!";
				$('#' + game.characters[this.myEnemy].id).remove();
				this.displayInstructions(2);
				game.enemyCount --;
				if(game.enemyCount == 0){
					game.displayInstructions(4);
				}
				else{
					this.chosenEnemy = false;
				}
			}
			$('#fight-status').html('<h2>' + txt + '</h2>');
			btnReset.disabled = false;
			var status = true;
			return status;
		}
	},

	changeBorder: function(character, classi){
		$('#'+ character).addClass(classi);
	},

	hitMe: function(){
		// increment turn count
		this.turnCount++;
		this.rndHit = this.coinFlip();
		// write current turn battle status
		var txt = "<h2>" + game.characters[this.rndHit].name + " hits first!</h2>"; 
		txt += "<h2>" + game.characters[this.myHero].name + " hits " + game.characters[this.myEnemy].name + " for " + game.characters[this.myHero].currAttack + " damage</h2>";
		txt += "<h2>" + game.characters[this.myEnemy].name + " hits " + game.characters[this.myHero].name + " for " + game.characters[this.myEnemy].currAttack + " damage</h2>";
		
		$('#fight-status').html(txt);
		
		// update game.myHero stats
		// hero hits first
		if(this.rndHit == this.myHero){
			game.characters[this.myEnemy].hit = game.characters[this.myEnemy].hit - game.characters[this.myHero].currAttack;
			game.characters[this.myHero].currAttack = game.characters[this.myHero].currAttack + game.characters[this.myHero].initAttack;
			game.characters[this.myHero].hit = game.characters[this.myHero].hit - game.characters[this.myEnemy].currAttack;
		}
		// else enemy hits first
		else{
			game.characters[this.myHero].hit = game.characters[this.myHero].hit - game.characters[this.myEnemy].currAttack;
			game.characters[this.myHero].currAttack = game.characters[this.myHero].currAttack + game.characters[this.myHero].initAttack;
			game.characters[this.myEnemy].hit = game.characters[this.myEnemy].hit - game.characters[this.myHero].currAttack;
		}
		// update stats in character div
		var txtHero = game.characters[this.myHero].name + '<hr><span id="hp">HP: ' + game.characters[this.myHero].hit + '</span><span id="att">ATT: ' + game.characters[game.myHero].currAttack + '</span>';	
		var txtEnemy = game.characters[this.myEnemy].name + '<hr><span id="hp">HP: ' + game.characters[this.myEnemy].hit + '</span><span id="att">ATT: ' + game.characters[game.myEnemy].currAttack + '</span>';
		$('#' + game.characters[this.myEnemy].id).html(txtEnemy);
		$('#' + game.characters[this.myHero].id).html(txtHero);
		// is there a winner?
		btnAttack.disabled = this.checkWinner();
	},

	characters: {
		char_0: {
			id: "char_0",
			name: "Obi-Wan Kenobi",
			shortname: "obiwan",
			hit: 120,
			initAttack: 12,
			currAttack: 12
		},
		char_1: {
			id: "char_1",
			name: "Luke Skywalker",
			shortname: "luke",
			hit: 100,
			initAttack: 5,
			currAttack: 5
		},
		char_2: {
			id: "char_2",
			name: "Anakin Skywalker",
			shortname: "anakin",
			hit: 150,
			initAttack: 15,
			currAttack: 15
		},
		char_3: {
			id: "char_3",
			name: "Darth Maul",
			shortname: "maul",
			hit: 180,
			initAttack: 20,
			currAttack: 20
		}
	}
}



	
$(document).ready(function() {	
	// place characters in the character choice area
	$.each(game.characters, function(index){
    	$('#character-choice').append(
    		'<div class="character" id="' + game.characters[index].id + '">' + game.characters[index].name + 
    		'<hr><span id="hp">HP: ' + game.characters[index].hit + '</span><span id="att">ATT: ' + game.characters[index].initAttack + '</span></div>'
    	);
	});
	// show initial instructions
	game.displayInstructions(0);
	// cycle enemies
	$('.character').click(function(){
		//if(game.enemyCount > 0){
			if(!game.chosenOne){
				game.chosenOne = true;
				game.myHero = this.id;
				game.changeBorder(this.id, 'hero');
				$('#' + this.id).off('click').appendTo('#fight-characters');
				game.displayInstructions(1);
			}
			else if(!game.chosenEnemy){
				game.chosenEnemy = true;
				game.myEnemy = this.id;
				game.changeBorder(this.id, 'enemy');
				$('#' + this.id).off('click').appendTo('#fight-characters');
				$('#fight-status').html("");
			}
			
			if(game.chosenOne && game.chosenEnemy){
				btnAttack.disabled = false;
				game.displayInstructions(3);
			}
		//}
		//else{
		//	game.displayInstructions(4);
		//}
	});
});
