import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Nav() {
  // Router
  const router = useRouter();

  return (
    <nav className="navbar navbar-custom">
      <div className="px-4 d-flex cursor-pointer align-items-center">
        {/* Will end up using TacVue logo here, but currently it doesn't match background */}
        <Image
          alt="Tacvue Logo"
          className="mr-2"
          src="/images/TacVue.png"
          width={70}
          height={60}
          onClick={() => router.push("/hq")}
        />

        <form className="px-4">
          <input
            type="search"
            placeholder="Search"
            aria-describedby="button-addon4"
            className="form-control search-bar"
          />
        </form>
      </div>

      <div className="px-4">
        {/* <a className="mx-4" onClick={() => router.push("/" + MARKETPLACE)}>
          Marketplace
        </a>
        <a className="mx-4" onClick={() => router.push("/" + COLLECTIBLES)}>
          Our Collectibles
        </a> */}

        {/* Should take you to display Card HQ */}
        <a>
          <i className="bi bi-bell mx-4" style={{ color: "white" }}></i>
        </a>
        <button
          className="btn btn-light rounded ml-4"
          id="walletButton"
          onClick={() => router.push("/hq")}
        >
          My Card
        </button>
      </div>
    </nav>
  );
}
