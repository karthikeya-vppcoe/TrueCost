import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Custom hook for GSAP animations on component mount
 * @param animationConfig - GSAP animation configuration
 * @param dependencies - Dependencies array for re-running animation
 */
export const useGSAPAnimation = (
    animationConfig: gsap.TweenVars,
    dependencies: any[] = []
) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!elementRef.current) return;

        const animation = gsap.from(elementRef.current, {
            duration: 0.6,
            ease: 'power3.out',
            ...animationConfig,
        });

        return () => {
            animation.kill();
        };
    }, dependencies);

    return elementRef;
};

/**
 * Custom hook for staggered GSAP animations on children elements
 * @param selector - CSS selector for children elements
 * @param animationConfig - GSAP animation configuration
 * @param dependencies - Dependencies array for re-running animation
 */
export const useGSAPStagger = (
    selector: string,
    animationConfig: gsap.TweenVars,
    dependencies: any[] = []
) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const children = containerRef.current.querySelectorAll(selector);
        if (children.length === 0) return;

        const animation = gsap.from(children, {
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            ...animationConfig,
        });

        return () => {
            animation.kill();
        };
    }, dependencies);

    return containerRef;
};

/**
 * Custom hook for hover GSAP animations
 * @param hoverConfig - Animation config for hover in
 * @param leaveConfig - Animation config for hover out
 */
export const useGSAPHover = (
    hoverConfig: gsap.TweenVars = { scale: 1.05, duration: 0.3 },
    leaveConfig: gsap.TweenVars = { scale: 1, duration: 0.3 }
) => {
    const elementRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        if (!elementRef.current) return;
        gsap.to(elementRef.current, {
            ease: 'power2.out',
            ...hoverConfig,
        });
    };

    const handleMouseLeave = () => {
        if (!elementRef.current) return;
        gsap.to(elementRef.current, {
            ease: 'power2.out',
            ...leaveConfig,
        });
    };

    return {
        ref: elementRef,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
    };
};
