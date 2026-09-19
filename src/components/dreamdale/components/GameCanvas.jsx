import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import DreamDaleScene from './DreamDaleScene.js'

export default function GameCanvas({
  playerName,
  farmCrops,
  onFarmCellClick,
  onNearbyChange,
  onMovementChange,
  touchDirection,
  paused = false,
}) {
  const containerRef = useRef(null)
  const gameRef = useRef(null)
  const sceneRef = useRef(null)
  const callbacksRef = useRef({ onFarmCellClick, onNearbyChange, onMovementChange })

  // Keep latest callbacks in a ref so Phaser always calls fresh handlers
  useEffect(() => {
    callbacksRef.current = { onFarmCellClick, onNearbyChange, onMovementChange }
  }, [onFarmCellClick, onNearbyChange, onMovementChange])

  useEffect(() => {
    if (gameRef.current) return

    const container = containerRef.current
    if (!container) return

    const w = container.clientWidth || 800
    const h = container.clientHeight || 600

    const config = {
      type: Phaser.AUTO,
      parent: container,
      width: w,
      height: h,
      backgroundColor: '#87CEEB',
      scene: [DreamDaleScene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      input: {
        mouse: true,
        touch: true,
      },
      render: {
        pixelArt: false,
        antialias: true,
        roundPixels: true,
      },
      audio: { noAudio: true },
    }

    const game = new Phaser.Game(config)
    gameRef.current = game

    game.events.once('ready', () => {
      const scene = game.scene.getScene('DreamDaleScene')
      if (!scene) return
      sceneRef.current = scene

      scene.onFarmCellClick = (plotIdx, cell) => {
        callbacksRef.current.onFarmCellClick?.(plotIdx, cell)
      }
      scene.onNearBuilding = (type) => {
        callbacksRef.current.onNearbyChange?.(type)
      }
      scene.onMovementChange = (data) => {
        callbacksRef.current.onMovementChange?.(data)
      }

      if (playerName) scene.setPlayerName(playerName)
      if (farmCrops) scene.setFarmCrops(farmCrops)
    })

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
        sceneRef.current = null
      }
    }
  }, [])

  // Update farm crops when they change
  useEffect(() => {
    if (sceneRef.current && farmCrops) {
      sceneRef.current.setFarmCrops(farmCrops)
    }
  }, [farmCrops])

  // Update player name
  useEffect(() => {
    if (sceneRef.current && playerName) {
      sceneRef.current.setPlayerName(playerName)
    }
  }, [playerName])

  // Update touch direction
  useEffect(() => {
    if (sceneRef.current && touchDirection) {
      sceneRef.current.setMoveDirection(touchDirection)
    }
  }, [touchDirection])

  // Pause player movement when a modal is open
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setPaused(paused)
    }
  }, [paused])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        touchAction: 'none',
        position: 'absolute',
        inset: 0,
      }}
    />
  )
}
