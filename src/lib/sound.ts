import click from './sounds/click.mp3';
import play from './sounds/play.mp3';
import gameover from './sounds/gameover.mp3';
import nextlevel from './sounds/nextlevel.mp3';

const sounds = { click, play, gameover, nextlevel };

export function playSound(name: keyof typeof sounds) {
	// Autoplay restrictions can reject playback; the game works without sound.
	new Audio(sounds[name]).play().catch(() => {});
}
