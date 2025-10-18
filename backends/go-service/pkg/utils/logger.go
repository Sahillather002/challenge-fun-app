package utils

import (
	"fmt"
	"log"
	"os"
	"time"
)

type LogLevel int

const (
	DEBUG LogLevel = iota
	INFO
	WARN
	ERROR
)

type Logger struct {
	level  LogLevel
	logger *log.Logger
}

func NewLogger(levelStr string) *Logger {
	var level LogLevel
	switch levelStr {
	case "debug":
		level = DEBUG
	case "info":
		level = INFO
	case "warn":
		level = WARN
	case "error":
		level = ERROR
	default:
		level = INFO
	}

	return &Logger{
		level:  level,
		logger: log.New(os.Stdout, "", 0),
	}
}

func (l *Logger) Debug(message string) {
	if l.level <= DEBUG {
		l.log("DEBUG", message)
	}
}

func (l *Logger) Debugf(format string, args ...interface{}) {
	if l.level <= DEBUG {
		l.log("DEBUG", fmt.Sprintf(format, args...))
	}
}

func (l *Logger) Info(message string) {
	if l.level <= INFO {
		l.log("INFO", message)
	}
}

func (l *Logger) Infof(format string, args ...interface{}) {
	if l.level <= INFO {
		l.log("INFO", fmt.Sprintf(format, args...))
	}
}

func (l *Logger) Warn(message string) {
	if l.level <= WARN {
		l.log("WARN", message)
	}
}

func (l *Logger) Warnf(format string, args ...interface{}) {
	if l.level <= WARN {
		l.log("WARN", fmt.Sprintf(format, args...))
	}
}

func (l *Logger) Error(message string) {
	if l.level <= ERROR {
		l.log("ERROR", message)
	}
}

func (l *Logger) Errorf(format string, args ...interface{}) {
	if l.level <= ERROR {
		l.log("ERROR", fmt.Sprintf(format, args...))
	}
}

func (l *Logger) log(level, message string) {
	timestamp := time.Now().Format("2006-01-02 15:04:05")
	l.logger.Printf("[%s] %s - %s", timestamp, level, message)
}
