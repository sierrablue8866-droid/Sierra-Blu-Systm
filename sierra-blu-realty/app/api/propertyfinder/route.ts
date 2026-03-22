import { NextResponse } from "next/server";
import { getProperties, getAgents } from "@/lib/firestore";
import { CONTACT } from "@/lib/site";
import { resolveProperties } from "@/lib/properties";

export async function GET() {
  try {
    const properties = resolveProperties(await getProperties());
    const agents = await getAgents();
    
    // Create a dictionary for quick agent lookup
    const agentsMap = agents.reduce((acc, agent) => {
      if (agent.id) {
        acc[agent.id] = {
          name: agent.name,
          email: agent.email,
          phone: agent.phone,
        };
      }
      return acc;
    }, {} as Record<string, { name: string; email: string; phone: string }>);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<list last_update="${new Date().toISOString()}">\n`;

    properties.forEach((prop) => {
      const agent = agentsMap[prop.agentRef] || {
        name: "Sierra Blu Advisory",
        email: CONTACT.email,
        phone: CONTACT.phoneDisplay,
      };

      xml += `  <property last_update="${prop.updatedAt}">\n`;
      xml += `    <reference_number>${prop.referenceNumber}</reference_number>\n`;
      xml += `    <permit_number>123456789</permit_number>\n`; // Required by some portals
      xml += `    <url>https://sierra-blu.com/listings/${encodeURIComponent(prop.referenceNumber)}</url>\n`;
      xml += `    <title><![CDATA[${prop.title}]]></title>\n`;
      xml += `    <description><![CDATA[${prop.description}]]></description>\n`;
      xml += `    <property_type>${prop.propertyType}</property_type>\n`;
      xml += `    <offer_type>${prop.offerType}</offer_type>\n`;
      xml += `    <price>${prop.price}</price>\n`;
      xml += `    <city><![CDATA[${prop.city}]]></city>\n`;
      xml += `    <community><![CDATA[${prop.community}]]></community>\n`;
      if (prop.subCommunity) {
        xml += `    <sub_community><![CDATA[${prop.subCommunity}]]></sub_community>\n`;
      }
      xml += `    <bedrooms>${prop.bedrooms}</bedrooms>\n`;
      xml += `    <bathrooms>${prop.bathrooms}</bathrooms>\n`;
      xml += `    <size>${prop.size}</size>\n`;
      
      // Agent Details
      xml += `    <agent>\n`;
      xml += `      <id>${prop.agentRef}</id>\n`;
      xml += `      <name><![CDATA[${agent.name}]]></name>\n`;
      xml += `      <email><![CDATA[${agent.email}]]></email>\n`;
      xml += `      <phone><![CDATA[${agent.phone}]]></phone>\n`;
      xml += `    </agent>\n`;

      // Facilities
      if (prop.facilities && prop.facilities.length > 0) {
        xml += `    <facilities>\n`;
        prop.facilities.forEach((fac) => {
          xml += `      <facility><![CDATA[${fac}]]></facility>\n`;
        });
        xml += `    </facilities>\n`;
      }

      // Photos
      if (prop.images && prop.images.length > 0) {
        xml += `    <photo>\n`;
        prop.images.forEach((img) => {
          xml += `      <url><![CDATA[${img}]]></url>\n`;
        });
        xml += `    </photo>\n`;
      }

      xml += `  </property>\n`;
    });

    xml += `</list>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("XML Feed Error:", error);
    return NextResponse.json({ error: "Failed to generate XML feed" }, { status: 500 });
  }
}
