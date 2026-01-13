"use client";

import React, { useRef } from "react";
import {
    Laptop,
    Smartphone,
    Settings,
    Database,
    Brain,
    Wand2,
    ArrowRight
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        id: 1,
        title: "Web Development",
        description: "We build high-performance, responsive websites that combine stunning visuals with seamless functionality to grow your online presence.",
        icon: Laptop,
        link: "#",
    },
    {
        id: 2,
        title: "App Development",
        description: "From iOS to Android, we create custom mobile applications designed to provide a smooth user experience and solve complex business problems.",
        icon: Smartphone,
        link: "#",
    },
    {
        id: 3,
        title: "ERP Solutions",
        description: "Streamline your entire operation with custom Enterprise Resource Planning tools that integrate finance, HR, and supply chain into one system.",
        icon: Settings,
        link: "#",
    },
    {
        id: 4,
        title: "Data Management",
        description: "We provide secure and scalable database architectures to ensure your business data is organized, protected, and easily accessible.",
        icon: Database,
        link: "#",
    },
    {
        id: 5,
        title: "AI Solutions",
        description: "Unlock the power of Machine Learning and Artificial Intelligence to automate decision-making and gain predictive insights for your business.",
        icon: Brain,
        link: "#",
    },
    {
        id: 6,
        title: "Automation",
        description: "Eliminate manual errors and save time by automating repetitive tasks and workflows, allowing your team to focus on what matters most.",
        icon: Wand2,
        link: "#",
    },
];

const ServiceSection = () => {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        // Header Animation
        gsap.fromTo(".service-header",
            {
                y: 50,
                autoAlpha: 0
            },
            {
                y: 0,
                autoAlpha: 1, // Ensures visibility is set to visible/opacity 1
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                    toggleActions: "play none none none", // Only play, don't reverse or hide
                    once: true, // Only trigger once to avoid hiding loops
                },
            }
        );

        // Cards Stagger Animation
        const cards = cardsRef.current.filter(Boolean);
        gsap.fromTo(cards,
            {
                y: 100,
                autoAlpha: 0
            },
            {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 85%",
                    toggleActions: "play none none none",
                    once: true,
                },
            }
        );
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="py-20 bg-[#F9FAFB]">
            <div className="container mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="service-header flex flex-col md:flex-row justify-between items-end mb-16 gap-6 opacity-0 invisible">
                    <div className="space-y-2">
                        <span className="text-[#FFB800] font-medium flex items-center gap-2">
                            <span className="w-4 h-[2px] bg-[#FFB800]"></span> Services
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                            Services <span className="font-light">We Provide</span>
                        </h2>
                    </div>

                    <button className="group flex items-center gap-4 bg-[#1e3a2f] text-white pl-6 pr-2 py-2 rounded-full hover:bg-[#152921] transition-colors duration-300">
                        <span className="font-medium">View All Services</span>
                        <div className="w-10 h-10 bg-[#FFB800] rounded-full flex items-center justify-center text-[#1e3a2f] group-hover:translate-x-1 transition-transform duration-300">
                            <ArrowRight size={20} />
                        </div>
                    </button>
                </div>

                {/* Grid */}
                <div ref={gridRef} className="service-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            ref={(el) => { if (el) cardsRef.current[index] = el; }}
                            className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 opacity-0 invisible"
                        >
                            <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#FFB800]/10 transition-colors duration-300">
                                <service.icon
                                    size={28}
                                    className="text-[#1e3a2f] group-hover:text-[#FFB800] transition-colors duration-300"
                                />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {service.title}
                            </h3>

                            <p className="text-gray-500 leading-relaxed mb-6 line-clamp-3">
                                {service.description}
                            </p>

                            <a
                                href={service.link}
                                className="inline-flex items-center gap-2 text-gray-900 font-medium group-hover:text-[#FFB800] transition-colors duration-300"
                            >
                                Learn more <ArrowRight size={16} />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceSection;
