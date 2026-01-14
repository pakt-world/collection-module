/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import "react-loading-skeleton/dist/skeleton.css";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import Logger from "../lib/logger";
import { paktSDKService } from "../lib/pakt-sdk";
import { applyTheme } from "../utils";
import defaultTheme from "../styles/default-theme";
import { ConfigContextType } from "../types";

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }
    return context;
};

interface ConfigProviderProps {
    config: ConfigContextType;
    children: ReactNode;
}

const ConfigProvider: React.FC<ConfigProviderProps> = ({
    config,
    children,
}) => {
    useEffect(() => {
        applyTheme({ ...defaultTheme, ...(config?.theme || {}) });
    }, [config]);

    useEffect(() => {
        if (config?.baseUrl) {
            paktSDKService
                .initialize({
                    baseUrl: config.baseUrl,
                    testnet: config.testnet,
                    verbose: config.verbose,
                })
                .catch((error) => {
                    Logger.error("Failed to initialize PAKT SDK:", error);
                });
        }
    }, [config?.baseUrl, config?.testnet, config?.verbose]);

    useEffect(() => {
        document.body.classList.add("pakt-collection-module");
        return () => document.body.classList.remove("pakt-collection-module");
    }, []);

    return (
        <ConfigContext.Provider value={config}>
            {children}
            <Toaster
                position="top-right"
                gutter={8}
                containerClassName="pka:!z-[999999]"
            />
        </ConfigContext.Provider>
    );
};

export { useConfig, ConfigProvider };
