"use client";

import { useState, useEffect, useCallback } from "react";
import { usePublicClient } from "wagmi";
import { Address, isAddress } from "viem";
import { Input } from "@/components/ui/input";
import { getCurrentNetworkAddresses, isResolverConfigured } from "@/contracts/addresses";
import { DOT_HYPE_RESOLVER_ABI } from "@/contracts/abis";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle, AlertCircle, User } from "lucide-react";

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onResolvedAddress?: (address: string | null) => void;
  onResolvedDomain?: (domain: string | null) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

export function AddressInput({
  value,
  onChange,
  onResolvedAddress,
  onResolvedDomain,
  placeholder = "Enter address or .hype domain",
  className,
  label = "Address / .hype Domain"
}: AddressInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [resolvedDomain, setResolvedDomain] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputType, setInputType] = useState<'address' | 'domain' | 'unknown'>('unknown');

  const publicClient = usePublicClient();
  const addresses = getCurrentNetworkAddresses();

  const resolveInput = useCallback(async (input: string) => {
    if (!publicClient || !input.trim() || !isResolverConfigured()) {
      setResolvedAddress(null);
      setResolvedDomain(null);
      setAvatar(null);
      setError(null);
      setInputType('unknown');
      onResolvedAddress?.(null);
      onResolvedDomain?.(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const trimmedInput = input.trim();
      
      // Check if input is an address
      if (isAddress(trimmedInput)) {
        setInputType('address');
        setResolvedAddress(trimmedInput);
        setResolvedDomain(null);
        setError(null); // Don't show resolution errors to user
        onResolvedDomain?.(null);

        // Try to get the primary domain for this address
        try {
          const domainName = await publicClient.readContract({
            address: addresses.DOT_HYPE_RESOLVER as Address,
            abi: DOT_HYPE_RESOLVER_ABI,
            functionName: "getName",
            args: [trimmedInput as Address],
          });

          if (domainName && typeof domainName === "string" && domainName.trim() !== "") {
            setResolvedDomain(domainName);
            onResolvedDomain?.(domainName);
          }
        } catch (err) {
          console.warn("Could not resolve domain for address:", err);
        }

        // Try to get avatar
        try {
          const avatarValue = await publicClient.readContract({
            address: addresses.DOT_HYPE_RESOLVER as Address,
            abi: DOT_HYPE_RESOLVER_ABI,
            functionName: "getValue",
            args: [trimmedInput as Address, "avatar"],
          });

          if (avatarValue && typeof avatarValue === "string" && avatarValue.trim() !== "") {
            setAvatar(avatarValue.trim());
          }
        } catch (err) {
          console.warn("Could not resolve avatar for address:", err);
        }
      }
      // Check if input is a .hype domain
      else if (trimmedInput.endsWith('.hype')) {
        setInputType('domain');
        console.warn("Resolution error:", err);
        setResolvedAddress(null);
        onResolvedDomain?.(trimmedInput);

        // Resolve domain to address
        try {
          const resolvedAddr = await publicClient.readContract({
            address: addresses.DOT_HYPE_RESOLVER as Address,
            abi: DOT_HYPE_RESOLVER_ABI,
            functionName: "resolve",
            args: [trimmedInput],
          });

          if (resolvedAddr && resolvedAddr !== "0x0000000000000000000000000000000000000000") {
            setResolvedAddress(resolvedAddr);
            onResolvedAddress?.(resolvedAddr);

            // Try to get avatar
            try {
              const avatarValue = await publicClient.readContract({
                address: addresses.DOT_HYPE_RESOLVER as Address,
                abi: DOT_HYPE_RESOLVER_ABI,
                functionName: "getValue",
                args: [resolvedAddr as Address, "avatar"],
              });

              if (avatarValue && typeof avatarValue === "string" && avatarValue.trim() !== "") {
                setAvatar(avatarValue.trim());
              }
            } catch (err) {
              console.warn("Could not resolve avatar for domain:", err);
            }
          } else {
            setError("Domain not found or not registered");
          }
        } catch (err) {
          console.error("Error resolving .hype domain:", err);
          setError("Failed to resolve .hype domain");
        }
      }
      else {
        setInputType('unknown');
        setError("Please enter a valid address or .hype domain");
      }
    } catch (err) {
      console.error("Error in resolveInput:", err);
      setError("Resolution failed");
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, addresses, onResolvedAddress, onResolvedDomain]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      resolveInput(value);
    }, 500); // Debounce

    return () => clearTimeout(timeoutId);
  }, [value, resolveInput]);

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="animate-spin" />;
    if (error) return <AlertCircle className="text-red-500" />;
    if (resolvedAddress) return <CheckCircle className="text-green-500" />;
    return null;
  };

  const getStatusMessage = () => {
    if (isLoading) return { text: "Resolving...", className: "text-blue-500" };
    if (error) return { text: error, className: "text-red-500" };
    if (inputType === 'address' && resolvedDomain) {
      return { text: `Resolved to ${resolvedDomain}`, className: "text-green-500" };
    }
    if (inputType === 'domain' && resolvedAddress) {
      return { text: `Resolved to ${resolvedAddress.slice(0, 6)}...${resolvedAddress.slice(-4)}`, className: "text-green-500" };
    }
    return null;
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="address-input-container">
      <label className="input-label">{label}</label>
      <div className="input-wrapper">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "address-input",
            isLoading && "loading",
            resolvedAddress && !error && "valid",
            error && "error",
            className
          )}
        />
        <div className="input-status-icon">
          {getStatusIcon()}
        </div>
      </div>
      
      {statusMessage && (
        <div className={cn("status-message", statusMessage.className)}>
          {statusMessage.text}
        </div>
      )}

      {(resolvedAddress || resolvedDomain) && !error && (
        <div className={cn(
          "resolution-display",
          inputType === 'domain' ? "domain" : "address"
        )}>
          <div className="resolution-content">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="avatar-thumbnail" />
            ) : (
              <User className="w-6 h-6 text-gray-400" />
            )}
            <div className="resolution-value">
              {inputType === 'domain' ? resolvedAddress : resolvedDomain || resolvedAddress}
            </div>
          </div>
        </div>
      )}

      <div className="help-text">
        Enter a wallet address (0x...) or .hype domain (name.hype)
      </div>
    </div>
  );
}