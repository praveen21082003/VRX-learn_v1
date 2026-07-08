import React from "react";
import { Certificate } from "../../assets";
import { Icon } from "@/components/ui";

function CertificateView() {
  return (
    <div className="space-y-2">
      <h4 className="text-h4 text-main ">Achievements</h4>

      <div className="relative h-64 overflow-hidden ">
        <img
          src={Certificate}
          alt="Certificate"
          className="absolute w-full h-full blur-sm "
        />

        <div className="absolute inset-0 flex flex-col  items-center justify-center">
          <span className="flex gap-2">
            <Icon
              name="streamline:star-badge-remix"
              width="24"
              height="24"
              className="text-[#D4AF37]"
            />
            <p className="font-bold text-black ">
              Complete a Course to Earn a Certificate
            </p>
          </span>
          <button className="mt-4 text-[#0088FF] underline underline-offset-3  font-semibold cursor-pointer">
            View Certificates
          </button>
        </div>
      </div>
    </div>
  );
}

export default CertificateView;
