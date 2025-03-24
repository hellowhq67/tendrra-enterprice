'use client'
import { BadgeDollarSignIcon, BotMessageSquare, ChartCandlestickIcon } from 'lucide-react'
import React from 'react'
import { Card } from "@/components/ui/card"

import { Bot, Brain, LineChart, Users } from "lucide-react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

export default function Dashboard() {
    const agents = [
        {
            name: "Marketing Agent",
            progress: 50,
            status: "Active",
        },
        {
            name: "Research Agent",
            progress: 92,
            status: "Active",
        },
        {
            name: "Content Creation",
            progress: 45,
            status: "Processing",
        },
        {
            name: "SEO Agent",
            progress: 86,
            status: "Active",
        },
        {
            name: "Vision AI",
            progress: 62,
            status: "Active",
        },
    ]
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-muted/50 flex   items-start justify-between  gap-2 p-4">
                    <div className='flex  flex-col items-start gap-2'>
                        <BotMessageSquare className='text-purple-500 size-8' />
                        <h2 className='text-gray-400 text-md'>Available Agents</h2>
                        <span className='text-white text-md'>{6}</span>
                    </div>
                    <div className='text-green-500'>
                        Active
                    </div>
                </div>
                <div className="rounded-xl bg-muted/50 flex   items-start justify-between  gap-2 p-4">
                    <div className='flex  flex-col items-start gap-2'>
                        <ChartCandlestickIcon className='size-8 text-green-500' />
                        <h2 className='text-gray-400 text-md'>Available Token</h2>
                        <span className='text-white text-md'>{60000}</span>
                    </div>

                </div>
                <div className="rounded-xl bg-muted/50 flex   items-start justify-between  gap-2 p-4">
                    <div className='flex  flex-col items-start gap-2'>
                        <BadgeDollarSignIcon className='text-orange-500 size-8' />

                        <h2 className='text-gray-400 text-md'>Subscription Type</h2>
                        <span className='text-white text-md'> Free</span>
                    </div>

                </div>

            </div>
            <div className="grid auto-rows-min gap-4 md:grid-cols-2 min-h-[100vh]">
                <div className="aspect-video rounded-xl bg-[#09090b] border border-sidebar-border" >
                    <Card className="p-6  border-none">
                        <h3 className="text-lg font-semibold mb-4 text-white"> Agent Status</h3>
                        <div className="space-y-4">
                            {agents.map((agent, index) => (
                                <motion.div
                                    key={agent.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-white">{agent.name}</span>
                                        <span className={`text-xs ${agent.status === 'Active' ? 'text-green-500' : 'text-yellow-500'
                                            }`}>
                                            {agent.status}
                                        </span>
                                    </div>
                                    <Progress value={agent.progress} className="h-2  " />
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </div>
                <div className="aspect-video rounded-xl bg-[#09090b] border border-sidebar-border" >
                    <Card className="p-6 border-none" >
                        <h3 className="text-lg font-semibold mb-4 text-white ">Recent Activities</h3>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                    <div>
                                        <p className="text-sm text-white">
                                            {["Marketing campaign generated", "Research report completed", "New blog post created", "SEO analysis finished", "Image analysis completed"][index]}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {`${index + 1} hour${index === 0 ? '' : 's'} ago`}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>


        </div>
    )
}
