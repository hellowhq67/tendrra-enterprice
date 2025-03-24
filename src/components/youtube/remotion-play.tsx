<<<<<<< HEAD
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { ShortsComposition } from "./remotion-composition";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react"; // Import Dispatch and SetStateAction

interface RemotionPlayerProps {
    images: string[];
    audio?: string;
    title?: string;
    captions?: { text: string; startFrame: number; endFrame: number }[];
    duration?: number;
    fps?: number;
    transitionDuration?: number;
    className?: string;
}

export function RemotionPlayer({
    images,
    audio,
    title,
    captions = [],
    duration = 10,
    fps = 30,
    transitionDuration = 30,
    className,
}: RemotionPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentFrame, setCurrentFrame] = useState<number>(0); // Define the type of the state to be a number
    const playerRef = useRef<PlayerRef>(null);

    const totalFrames = duration * fps;

    const handlePlayPause = () => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.pause();
            } else {
                playerRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleRestart = () => {
        if (playerRef.current) {
            playerRef.current.seekTo(0);
            setCurrentFrame(0);
        }
    };

    const handleForward = () => {
        if (playerRef.current) {
            const newFrame = Math.min(currentFrame + fps, totalFrames - 1);
            playerRef.current.seekTo(newFrame);
            setCurrentFrame(newFrame);
        }
    };

    const handleBackward = () => {
        if (playerRef.current) {
            const newFrame = Math.max(currentFrame - fps, 0);
            playerRef.current.seekTo(newFrame);
            setCurrentFrame(newFrame);
        }
    };

    const handleSeek = (value: number[]) => {
        if (playerRef.current) {
            const frame = value[0];
            playerRef.current.seekTo(frame);
            setCurrentFrame(frame);
        }
    };

    // Format time as MM:SS
    const formatTime = (frameNumber: number) => {
        const seconds = Math.floor(frameNumber / fps);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    // Use useCallback to memoize the setCurrentFrame callback
    const handleFrameChange = useCallback((frame: number) => {
        setCurrentFrame(frame);
    }, [setCurrentFrame]);

    return (
        <div className={`flex flex-col space-y-4 ${className}`}>
            <div className="relative aspect-[9/16] overflow-hidden rounded-lg border border-gray-800">
                {images.length > 0 ? (
                    <Player
                        ref={playerRef}
                        component={ShortsComposition}
                        inputProps={{
                            images,
                            audio,
                            title,
                            captions,
                            duration,
                            fps,
                            transitionDuration,
                            setCurrentFrame: handleFrameChange, // Pass the memoized function
                        }}
                        durationInFrames={totalFrames}
                        fps={fps}
                        style={{ width: "100%", height: "100%" }}
                        compositionWidth={1080}
                        compositionHeight={1920}
                        autoPlay={false}
                        loop
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gray-900">
                        <p className="text-gray-400">Add images to preview video</p>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{formatTime(currentFrame)}</span>
                    <span className="text-xs text-gray-400">{formatTime(totalFrames)}</span>
                </div>

                <Slider
                    value={[currentFrame]}
                    min={0}
                    max={totalFrames - 1}
                    step={1}
                    onValueChange={handleSeek}
                    className="w-full"
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={handleBackward} disabled={images.length === 0}>
                            <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={handlePlayPause} disabled={images.length === 0}>
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleForward} disabled={images.length === 0}>
                            <SkipForward className="h-4 w-4" />
                        </Button>
                    </div>

                    {audio && (
                      <div className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4" />
                      </div>
                    )}
                </div>
            </div>
        </div>
    );
=======
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { ShortsComposition } from "./remotion-composition";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react"; // Import Dispatch and SetStateAction

interface RemotionPlayerProps {
    images: string[];
    audio?: string;
    title?: string;
    captions?: { text: string; startFrame: number; endFrame: number }[];
    duration?: number;
    fps?: number;
    transitionDuration?: number;
    className?: string;
}

export function RemotionPlayer({
    images,
    audio,
    title,
    captions = [],
    duration = 10,
    fps = 30,
    transitionDuration = 30,
    className,
}: RemotionPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentFrame, setCurrentFrame] = useState<number>(0); // Define the type of the state to be a number
    const playerRef = useRef<PlayerRef>(null);

    const totalFrames = duration * fps;

    const handlePlayPause = () => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.pause();
            } else {
                playerRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleRestart = () => {
        if (playerRef.current) {
            playerRef.current.seekTo(0);
            setCurrentFrame(0);
        }
    };

    const handleForward = () => {
        if (playerRef.current) {
            const newFrame = Math.min(currentFrame + fps, totalFrames - 1);
            playerRef.current.seekTo(newFrame);
            setCurrentFrame(newFrame);
        }
    };

    const handleBackward = () => {
        if (playerRef.current) {
            const newFrame = Math.max(currentFrame - fps, 0);
            playerRef.current.seekTo(newFrame);
            setCurrentFrame(newFrame);
        }
    };

    const handleSeek = (value: number[]) => {
        if (playerRef.current) {
            const frame = value[0];
            playerRef.current.seekTo(frame);
            setCurrentFrame(frame);
        }
    };

    // Format time as MM:SS
    const formatTime = (frameNumber: number) => {
        const seconds = Math.floor(frameNumber / fps);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    // Use useCallback to memoize the setCurrentFrame callback
    const handleFrameChange = useCallback((frame: number) => {
        setCurrentFrame(frame);
    }, [setCurrentFrame]);

    return (
        <div className={`flex flex-col space-y-4 ${className}`}>
            <div className="relative aspect-[9/16] overflow-hidden rounded-lg border border-gray-800">
                {images.length > 0 ? (
                    <Player
                        ref={playerRef}
                        component={ShortsComposition}
                        inputProps={{
                            images,
                            audio,
                            title,
                            captions,
                            duration,
                            fps,
                            transitionDuration,
                            setCurrentFrame: handleFrameChange, // Pass the memoized function
                        }}
                        durationInFrames={totalFrames}
                        fps={fps}
                        style={{ width: "100%", height: "100%" }}
                        compositionWidth={1080}
                        compositionHeight={1920}
                        autoPlay={false}
                        loop
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gray-900">
                        <p className="text-gray-400">Add images to preview video</p>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{formatTime(currentFrame)}</span>
                    <span className="text-xs text-gray-400">{formatTime(totalFrames)}</span>
                </div>

                <Slider
                    value={[currentFrame]}
                    min={0}
                    max={totalFrames - 1}
                    step={1}
                    onValueChange={handleSeek}
                    className="w-full"
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={handleBackward} disabled={images.length === 0}>
                            <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={handlePlayPause} disabled={images.length === 0}>
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleForward} disabled={images.length === 0}>
                            <SkipForward className="h-4 w-4" />
                        </Button>
                    </div>

                    {audio && (
                      <div className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4" />
                      </div>
                    )}
                </div>
            </div>
        </div>
    );
>>>>>>> 157dbbd44305f033179137915d3429a7d0bed63c
}