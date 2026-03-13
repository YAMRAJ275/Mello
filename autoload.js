/**
 * AUTO FILE LOADER
 * Ye file automatically nayi commands/events ko detect karegi aur load karegi
 * Bina bot restart kiye!
 */

const fs = require('fs-extra');
const path = require('path');
const chokidar = require('chokidar'); // File watching ke liye

module.exports = {
    autoLoad: function(api, client, models, threads, users, database, utils, global, config, commands, eventCommands) {
        
        // Paths
        const commandsPath = path.join(__dirname, 'commands');
        const eventsPath = path.join(__dirname, 'events');
        
        console.log('👀 Auto-Loader Active - Watching for new files...');

        // 📁 Commands folder watch
        const commandWatcher = chokidar.watch(commandsPath, {
            ignored: /(^|[\/\\])\../,
            persistent: true,
            ignoreInitial: true
        });

        // New command file added
        commandWatcher.on('add', (filePath) => {
            console.log(`✨ New command detected: ${path.basename(filePath)}`);
            
            try {
                // File check
                if (!filePath.endsWith('.js')) return;
                
                // Delete cache
                delete require.cache[require.resolve(filePath)];
                
                // Load command
                const command = require(filePath);
                
                // Command name
                const commandName = path.basename(filePath, '.js');
                
                // Add to commands list
                if (command && command.name) {
                    commands.set(command.name.toLowerCase(), command);
                    console.log(`✅ Command '${command.name}' loaded successfully!`);
                } else if (command && command.config && command.config.name) {
                    commands.set(command.config.name.toLowerCase(), command);
                    console.log(`✅ Command '${command.config.name}' loaded successfully!`);
                } else {
                    commands.set(commandName.toLowerCase(), command);
                    console.log(`✅ Command '${commandName}' loaded successfully!`);
                }
                
                // Notification
                api.sendMessage(`📦 **New Command Loaded**\n\n📁 File: ${path.basename(filePath)}\n💬 Use: .${commandName}`, config.ADMINBOT[0]);
                
            } catch (error) {
                console.error(`❌ Error loading command: ${error.message}`);
            }
        });

        // 📁 Events folder watch
        const eventWatcher = chokidar.watch(eventsPath, {
            ignored: /(^|[\/\\])\../,
            persistent: true,
            ignoreInitial: true
        });

        // New event file added
        eventWatcher.on('add', (filePath) => {
            console.log(`✨ New event detected: ${path.basename(filePath)}`);
            
            try {
                if (!filePath.endsWith('.js')) return;
                
                delete require.cache[require.resolve(filePath)];
                const event = require(filePath);
                const eventName = path.basename(filePath, '.js');
                
                eventCommands.set(eventName.toLowerCase(), event);
                console.log(`✅ Event '${eventName}' loaded successfully!`);
                
                api.sendMessage(`🎯 **New Event Loaded**\n\n📁 File: ${path.basename(filePath)}`, config.ADMINBOT[0]);
                
            } catch (error) {
                console.error(`❌ Error loading event: ${error.message}`);
            }
        });

        // File change detection
        commandWatcher.on('change', (filePath) => {
            console.log(`✏️ Command modified: ${path.basename(filePath)}`);
            reloadFile(filePath, 'command', api, commands, config);
        });

        eventWatcher.on('change', (filePath) => {
            console.log(`✏️ Event modified: ${path.basename(filePath)}`);
            reloadFile(filePath, 'event', api, eventCommands, config);
        });

        // File delete detection
        commandWatcher.on('unlink', (filePath) => {
            console.log(`🗑️ Command removed: ${path.basename(filePath)}`);
            const commandName = path.basename(filePath, '.js');
            commands.delete(commandName.toLowerCase());
            
            // Find and delete by config name
            commands.forEach((cmd, name) => {
                if (cmd.config && cmd.config.name === commandName) {
                    commands.delete(name);
                }
            });
        });

        eventWatcher.on('unlink', (filePath) => {
            console.log(`🗑️ Event removed: ${path.basename(filePath)}`);
            const eventName = path.basename(filePath, '.js');
            eventCommands.delete(eventName.toLowerCase());
        });

        // Reload function
        function reloadFile(filePath, type, api, collection, config) {
            try {
                const fileName = path.basename(filePath);
                const itemName = path.basename(filePath, '.js');
                
                delete require.cache[require.resolve(filePath)];
                const item = require(filePath);
                
                if (type === 'command') {
                    if (item && item.name) {
                        collection.set(item.name.toLowerCase(), item);
                    } else if (item && item.config && item.config.name) {
                        collection.set(item.config.name.toLowerCase(), item);
                    } else {
                        collection.set(itemName.toLowerCase(), item);
                    }
                } else {
                    collection.set(itemName.toLowerCase(), item);
                }
                
                console.log(`🔄 ${type} reloaded: ${fileName}`);
                
            } catch (error) {
                console.error(`❌ Error reloading ${type}: ${error.message}`);
            }
        }

        // Manual reload command
        const reloadCommand = {
            name: 'reloadall',
            config: {
                name: 'reloadall',
                description: 'Reload all commands and events',
                usage: '.reloadall',
                adminOnly: true
            },
            run: async function({ api, event, args, commands, eventCommands }) {
                const loadingMsg = await api.sendMessage('🔄 Reloading all files...', event.threadID);
                
                try {
                    // Reload commands
                    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
                    let cmdCount = 0;
                    
                    for (const file of commandFiles) {
                        const filePath = path.join(commandsPath, file);
                        delete require.cache[require.resolve(filePath)];
                        const command = require(filePath);
                        
                        if (command && command.name) {
                            commands.set(command.name.toLowerCase(), command);
                        } else if (command && command.config && command.config.name) {
                            commands.set(command.config.name.toLowerCase(), command);
                        } else {
                            commands.set(file.replace('.js', '').toLowerCase(), command);
                        }
                        cmdCount++;
                    }
                    
                    // Reload events
                    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
                    let evtCount = 0;
                    
                    for (const file of eventFiles) {
                        const filePath = path.join(eventsPath, file);
                        delete require.cache[require.resolve(filePath)];
                        const event = require(filePath);
                        eventCommands.set(file.replace('.js', '').toLowerCase(), event);
                        evtCount++;
                    }
                    
                    api.sendMessage(`✅ **Reload Complete**\n\n📁 Commands: ${cmdCount}\n🎯 Events: ${evtCount}`, event.threadID);
                    
                } catch (error) {
                    api.sendMessage(`❌ Error: ${error.message}`, event.threadID);
                }
            }
        };
        
        // Add reload command if not exists
        if (!commands.has('reloadall')) {
            commands.set('reloadall', reloadCommand);
        }
        
        return { commandWatcher, eventWatcher };
    }
};