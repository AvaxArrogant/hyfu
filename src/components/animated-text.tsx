
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  triggerOnHover?: boolean;
  neverDecrypt?: boolean;
}

const chars = '01<>/_\\|[]{}*&^%$#@!';

export function AnimatedText({ text, className, delay = 0, triggerOnHover = false, neverDecrypt = false }: AnimatedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  
  const [displayText, setDisplayText] = useState(neverDecrypt ? text.split('').map(() => '\u00A0').join('') : text);

  const scramble = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    let iteration = 0;
    
    clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      element.innerText = text
        .split('')
        .map((char, index) => {
          if(!neverDecrypt && index < iteration) {
            return text[index];
          }
          if(char === ' ') return ' ';
          return chars[Math.floor(Math.random() * chars.length)]
        })
        .join('');
      
      if(!neverDecrypt && iteration >= text.length){
        clearInterval(intervalRef.current);
      }
      
      iteration += 1;
    }, 30);
  }, [text, neverDecrypt]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (triggerOnHover) {
      element.addEventListener('mouseenter', scramble);
    } else {
      const timeout = setTimeout(scramble, delay);
      return () => clearTimeout(timeout);
    }
    
    return () => {
      if (triggerOnHover) {
        element.removeEventListener('mouseenter', scramble);
      }
      clearInterval(intervalRef.current);
    };
  }, [text, delay, triggerOnHover, scramble]);

  return <span ref={ref} className={cn('font-code', className)}>{displayText}</span>;
}
