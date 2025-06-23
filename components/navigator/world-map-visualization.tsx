"use client"

import { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, MapPin, Plus, Minus, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

// Simple, reliable world map data
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

// Hotel location in Dubai
const hotelLocation = {
  name: "Your Hotel",
  coordinates: [55.2708, 25.2048] as [number, number],
  city: "Dubai, UAE"
}

// Source market data
const sourceMarkets = [
  {
    name: "United States",
    coordinates: [-95.7129, 37.0902] as [number, number],
    percent: 30,
    value: "$2.1M",
    color: "#3b82f6"
  },
  {
    name: "United Kingdom", 
    coordinates: [-3.4360, 55.3781] as [number, number],
    percent: 20,
    value: "$1.4M",
    color: "#10b981"
  },
  {
    name: "Germany",
    coordinates: [10.4515, 51.1657] as [number, number],
    percent: 10,
    value: "$700K",
    color: "#8b5cf6"
  },
  {
    name: "France",
    coordinates: [2.2137, 46.2276] as [number, number],
    percent: 5,
    value: "$350K",
    color: "#f59e0b"
  },
  {
    name: "Canada",
    coordinates: [-106.3468, 56.1304] as [number, number],
    percent: 5,
    value: "$350K",
    color: "#ef4444"
  }
]

interface TooltipData {
  name: string
  percent?: number
  value?: string
  city?: string
  type: string
  x: number
  y: number
}

export function WorldMapVisualization() {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState<[number, number]>([10, 35])

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 8))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.5))
  }

  const handleReset = () => {
    setZoom(1)
    setCenter([10, 35])
  }

  const handleMarkerHover = (market: typeof sourceMarkets[0], event: React.MouseEvent) => {
    setTooltip({
      name: market.name,
      percent: market.percent,
      value: market.value,
      type: "market",
      x: event.clientX,
      y: event.clientY
    })
  }

  const handleHotelHover = (event: React.MouseEvent) => {
    setTooltip({
      name: hotelLocation.name,
      city: hotelLocation.city,
      type: "hotel",
      x: event.clientX,
      y: event.clientY
    })
  }

  const handleMarkerLeave = () => {
    setTooltip(null)
  }

  return (
    <div className="relative">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="w-full h-[400px] bg-slate-50 relative">
            {/* Google Maps Style Zoom Controls */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 8}
                className="h-8 w-8 p-0 rounded-none hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                title="Zoom in"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <div className="h-px bg-gray-200 dark:bg-gray-700" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="h-8 w-8 p-0 rounded-none hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                title="Zoom out"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="h-px bg-gray-200 dark:bg-gray-700" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8 w-8 p-0 rounded-none hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Reset view"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 160,
                center: center
              }}
              width={800}
              height={400}
              style={{ width: "100%", height: "100%" }}
            >
              <ZoomableGroup
                zoom={zoom}
                center={center}
                onMoveEnd={(position) => setCenter(position.coordinates)}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#e2e8f0"
                        stroke="#cbd5e1"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none", fill: "#cbd5e1" },
                          pressed: { outline: "none" }
                        }}
                      />
                    ))
                  }
                </Geographies>

                {/* Hotel marker in Dubai */}
                <Marker
                  coordinates={hotelLocation.coordinates}
                  onMouseEnter={handleHotelHover}
                  onMouseLeave={handleMarkerLeave}
                >
                  <circle
                    r={8}
                    fill="#dc2626"
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="cursor-pointer"
                  />
                  <text
                    textAnchor="middle"
                    y={20}
                    className="fill-slate-700 text-xs font-medium"
                    style={{ fontSize: '10px' }}
                  >
                    Hotel
                  </text>
                </Marker>
                
                {/* Source market markers */}
                {sourceMarkets.map((market) => (
                  <Marker
                    key={market.name}
                    coordinates={market.coordinates}
                    onMouseEnter={(e) => handleMarkerHover(market, e)}
                    onMouseLeave={handleMarkerLeave}
                  >
                    <circle
                      r={Math.max(6, market.percent / 3)}
                      fill={market.color}
                      stroke="#ffffff"
                      strokeWidth={2}
                      className="cursor-pointer"
                    />
                    <text
                      textAnchor="middle"
                      y={Math.max(6, market.percent / 3) + 15}
                      className="fill-slate-700 text-xs font-medium"
                      style={{ fontSize: '10px' }}
                    >
                      {market.percent}%
                    </text>
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </CardContent>
      </Card>

      {/* Simple Legend */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 rounded-full bg-red-600"></div>
          <span>Your Hotel - Dubai, UAE</span>
        </div>
        
        <div className="text-sm font-medium text-slate-700 mb-2">Top Source Markets:</div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {sourceMarkets.map((market) => (
            <div key={market.name} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: market.color }}
              />
              <span className="text-xs">
                {market.name} ({market.percent}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Simple Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 bg-black text-white text-xs rounded shadow-lg pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="font-medium">{tooltip.name}</div>
          {tooltip.type === "market" ? (
            <div>{tooltip.percent}% • {tooltip.value}</div>
          ) : (
            <div>{tooltip.city}</div>
          )}
        </div>
      )}
    </div>
  )
} 