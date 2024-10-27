import React from 'react'
import { IoBriefcaseSharp } from "react-icons/io5";
import Image from 'next/image'

const ExperienceItem = ({ title, company, timePeriod, location, description }) => {
    return (
        <div className="mt-16">
            <div className="justify-between text-white border-0 md:flex">
                <div className="flex font-bold text-blue-400 sm1:text-lg md:text-xl">
                    <span>{title}</span>
                    <span className="ml-4 text-gray-400">| {company}</span>
                </div>
                <div className="text-sm text-white">{timePeriod}</div>
            </div>
            <div className="mt-1 text-gray-400 text-sm">{location}</div>
            <div className="mt-2">{description}</div>
        </div>
    )
}

const Experience = () => {
  return (
    <div className="mb-20 text-white">
        <div className="font-extrabold tracking-tighter text-center text-blue-400 sm1:text-xl sm1:p-6 md:pl-20 md:text-6xl">
            Experience
        </div>
        
        <div className="m-auto sm1:p-6 md:p-10 lg:p-20 lg:w-4/5 xl:w-3/5 md:mt-0">
            <ExperienceItem
                title="Full Stack Developer"
                company="Yongtai Quanwei Decor Ltd. (Startup)"
                timePeriod="Jul 2023 - Jun 2024"
                location="Beijing, China"
                description="Contributed over 5000 lines of Java and JavaScript code, developed 25+ APIs, created 75+ reports/logical maps, and provided extensive debug documentation. Built reusable components with React hooks, integrated WebSocket and Redux for global state management, and implemented jQuery and lazy loading to reduce page load time from 450ms to 260ms. Collaborated with Cloud DevOps, using Jest and CI processes, achieving 80% JUnit test coverage. Utilized AliCloud (similar to AWS EC2, Shield, and S3) for online payment and security."
            />
            <ExperienceItem
                title="Full Stack Developer"
                company="ArcPath International Edu."
                timePeriod="Summer 2021, 2022"
                location="Shenyang, China"
                description="Developed and maintained themes, course modules, and search features, contributing 3000+ lines of JavaScript and PHP code. Rebuilt MySQL database with backend team, improving CURD response time by 15%. Addressed OAuth2 token redirect issues, gained expertise in Laravel and monorepos, and supported seamless user experience for over 1000 users."
            />
        </div>
    </div>
  )
}

export default Experience
