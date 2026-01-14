"use client";
import CoreFlowSection from "@/components/landing/CoreFlowSection/page";
import DefinitionSection from "@/components/landing/DefinitionSection/page";
import FeatureSection from "@/components/landing/FeatureSection/page";
import HeroSection from "@/components/landing/HeroSection/Page";
import MindMapSection from "@/components/landing/MindMapSection/page";
import TokenMechanicsSection from "@/components/landing/TokenMechanicsSection/page";
import NetworkInfoWidget from "@/components/landing/NetworkInfoWidget/page";
import NetworkInfoOverlay from "@/components/landing/NetworkInfoOverlay";

export default function LandingPage() {
  return (
    <>
      <NetworkInfoOverlay />
      <HeroSection />
      <FeatureSection />
      <DefinitionSection />
      <TokenMechanicsSection />
      <MindMapSection />
      <CoreFlowSection />
      <NetworkInfoWidget />
    </>
  );
}
